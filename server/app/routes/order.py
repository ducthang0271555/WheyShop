from flask import Blueprint, request, jsonify
from flask_jwt_extended import verify_jwt_in_request
from app.models import Product, ProductFlavor, Order, OrderItem, Cart
from app.extensions import db, payos
from app.utils.helper import generate_unique_order_code
from app.routes.cart import get_current_user_id
import time
import os

order_bp = Blueprint('orders', __name__)


@order_bp.route('/create', methods=['POST'])
def create_order():
    user_id = None
    try:
        verify_jwt_in_request(optional=True)
        user_id = get_current_user_id()
    except:
        user_id = None

    data = request.json
    customer_info = data.get('customerInfo')
    cart_items = data.get('items')
    total_price = int(data.get('total_price'))
    payment_method = data.get('payment_method', 'COD')

    if not cart_items:
        return jsonify({'error': 'Giỏ hàng trống'}), 400

    new_order_code = generate_unique_order_code(8)
    while Order.query.filter_by(order_code=new_order_code).first():
        new_order_code = generate_unique_order_code(8)

    payos_code = int(time.time())

    new_order = Order(
        user_id=user_id,
        order_code=new_order_code,
        payos_order_code=payos_code if payment_method == 'BANK' else None,
        full_name=customer_info.get('name'),
        phone=customer_info.get('phone'),
        address=f"{customer_info.get('address')}, {customer_info.get('ward')}, {customer_info.get('district')}, {customer_info.get('city')}",
        note=customer_info.get('note'),
        total_amount=total_price,
        status='PENDING',
        payment_method=payment_method
    )

    db.session.add(new_order)
    db.session.flush()

    for item in cart_items:
        p_id = item.get('product_id') or item.get('id')
        f_id = item.get('flavor_id')
        qty = int(item.get('quantity'))

        if f_id:
            flavor = ProductFlavor.query.get(f_id)
            if not flavor:
                db.session.rollback()
                return jsonify({'error': f"Hương vị không tồn tại (ID: {f_id})"}), 404

            if flavor.stock < qty:
                db.session.rollback()
                return jsonify({
                                   'error': f"Sản phẩm {item.get('product_name')} - {flavor.flavor_name} không đủ hàng. Chỉ còn {flavor.stock}."}), 400

            flavor.stock -= qty

            if flavor.product:
                current_sold = flavor.product.sold_count if flavor.product.sold_count else 0
                flavor.product.sold_count = current_sold + qty
        else:
            product = Product.query.get(p_id)
            if not product:
                db.session.rollback()
                return jsonify({'error': f"Sản phẩm không tồn tại (ID: {p_id})"}), 404

            if product.stock < qty:
                db.session.rollback()
                return jsonify({'error': f"Sản phẩm {product.name} không đủ hàng. Chỉ còn {product.stock}."}), 400

            product.stock -= qty

            current_sold = product.sold_count if product.sold_count else 0
            product.sold_count = current_sold + qty

        order_item = OrderItem(
            order_id=new_order.id,
            product_id=p_id,
            flavor_id=item.get('flavor_id'),
            gift_id=item.get('gift_id'),
            quantity=qty,
            price=item.get('final_price'),
            product_name=item.get('product_name'),
            flavor_name=item.get('flavor_name'),
            gift_name=item.get('gift_name'),
            image_url=item.get('image_url')
        )
        db.session.add(order_item)

    if user_id:
        Cart.query.filter_by(user_id=user_id).delete()

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Lỗi hệ thống khi lưu đơn hàng: {str(e)}'}), 500

    if payment_method == 'BANK':
        try:
            domain = os.environ.get('YOUR_DOMAIN')

            payos_items = []
            calculated_total = 0

            for item in cart_items:
                item_price = int(item.get('final_price', 0))
                if item_price > 0:
                    name = item.get('product_name', 'Product')[:50]
                    qty = int(item.get('quantity'))
                    payos_items.append({
                        "name": name,
                        "quantity": qty,
                        "price": item_price
                    })
                    calculated_total += (item_price * qty)

            final_items_payload = payos_items if calculated_total == total_price else []

            payment_data = {
                "orderCode": payos_code,
                "amount": int(total_price),
                "description": f"Thanh toan {new_order_code}",
                "items": final_items_payload,
                "cancelUrl": f"{domain}/order-success?ref={new_order_code}&cancel=true",
                "returnUrl": f"{domain}/order-success?ref={new_order_code}"
            }

            payos_link = payos.payment_requests.create(payment_data)

            return jsonify({
                'message': 'Order created',
                'order_code': new_order_code,
                'checkoutUrl': payos_link.checkout_url
            }), 200

        except Exception as e:
            print("PayOS Error:", e)
            return jsonify({'error': f'Lỗi tạo link thanh toán: {str(e)}'}), 500

    return jsonify({
        'message': 'Order created successfully',
        'order_code': new_order_code
    }), 200


@order_bp.route('/payos-webhook', methods=['POST'])
def payos_webhook():
    data = request.json

    try:
        if not data:
            return jsonify({"error": "No data received"}), 400

        webhook_data = payos.webhooks.verify(data)

        payos_order_code = webhook_data.order_code
        amount = webhook_data.amount

        order = Order.query.filter_by(payos_order_code=payos_order_code).first()

        if order:
            if order.status != 'PAID':

                if int(order.total_amount) != int(amount):
                    return jsonify({"error": "Amount mismatch"}), 400

                order.status = 'PAID'
                db.session.commit()

            return jsonify({"success": True}), 200
        else:
            return jsonify({"success": True}), 200

    except Exception as e:
        print(">>> WEBHOOK ERROR:", str(e))
        return jsonify({"error": str(e)}), 400