from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import json
from app.extensions import db
from app.models import Cart, Product

cart_bp = Blueprint('cart', __name__)


def get_current_user_id():
    identity = get_jwt_identity()

    if not identity:
        return None

    if isinstance(identity, int):
        return identity

    if isinstance(identity, dict):
        return identity.get('id')

    if isinstance(identity, str):
        try:
            data = json.loads(identity)
            return data.get('id')
        except:
            if identity.isdigit():
                return int(identity)

    return None


@cart_bp.route('/add-to-cart', methods=['POST'])
@jwt_required()
def add_to_cart():
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({'error': 'Invalid User ID in Token'}), 401

    data = request.json
    product_id = data.get('product_id')
    flavor_id = data.get('flavor_id')
    gift_id = data.get('gift_id')
    quantity = int(data.get('quantity', 1))

    if not product_id:
        return jsonify({'error': 'Product ID is required'}), 400

    product = Product.query.get(product_id)
    if not product:
        return jsonify({'error': 'Product not found'}), 404

    cart_item = Cart.query.filter_by(
        user_id=user_id,
        product_id=product_id,
        flavor_id=flavor_id,
        gift_id=gift_id
    ).first()

    if cart_item:
        cart_item.quantity += quantity
    else:
        cart_item = Cart(
            user_id=user_id,
            product_id=product_id,
            flavor_id=flavor_id,
            gift_id=gift_id,
            quantity=quantity
        )
        db.session.add(cart_item)

    try:
        db.session.commit()
        return jsonify({'message': 'Item added to cart successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@cart_bp.route('/get-cart', methods=['GET'])
@jwt_required()
def get_cart():
    user_id = get_current_user_id()

    if not user_id:
        return jsonify({'error': 'Invalid Token Identity'}), 401

    cart_items = Cart.query.filter_by(user_id=user_id).all()

    result = []
    total_cart_price = 0

    for item in cart_items:
        product = item.product
        flavor = item.flavor
        gift = item.gift

        base_price = flavor.price if (flavor and flavor.price > 0) else product.price

        if item.gift_id == 2:
            base_price = base_price - 30000
            if base_price < 0: base_price = 0

        final_price = float(base_price) * (1 - (product.discount_percent or 0) / 100)

        image_url = flavor.image_url if (flavor and flavor.image_url) else product.img_url

        item_total = final_price * item.quantity
        total_cart_price += item_total

        result.append({
            'cart_id': item.id,
            'product_id': product.id,
            'product_name': product.name,
            'flavor_name': flavor.flavor_name if flavor else None,

            'gift_name': gift.name if gift else None,
            'gift_id': item.gift_id,

            'image_url': image_url,
            'price': float(product.price),
            'final_price': final_price,
            'quantity': item.quantity,
            'total': item_total
        })

    return jsonify({
        'cart_items': result,
        'total_cart_price': total_cart_price
    }), 200


@cart_bp.route('/update/<int:cart_id>', methods=['PUT'])
@jwt_required()
def update_cart_item(cart_id):
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({'error': 'Invalid User ID in Token'}), 401

    data = request.json
    new_quantity = data.get('quantity')

    if new_quantity is None or int(new_quantity) < 1:
        return jsonify({'error': 'Invalid quantity'}), 400

    cart_item = Cart.query.filter_by(id=cart_id, user_id=user_id).first()

    if not cart_item:
        return jsonify({'error': 'Cart item not found'}), 404

    cart_item.quantity = int(new_quantity)
    db.session.commit()

    return jsonify({'message': 'Cart updated'}), 200


@cart_bp.route('/delete/<int:cart_id>', methods=['DELETE'])
@jwt_required()
def delete_cart_item(cart_id):
    user_id = get_current_user_id()

    cart_item = Cart.query.filter_by(id=cart_id, user_id=user_id).first()

    if not cart_item:
        return jsonify({'error': 'Cart item not found'}), 404

    db.session.delete(cart_item)
    db.session.commit()

    return jsonify({'message': 'Item removed from cart'}), 200


@cart_bp.route('/clear', methods=['DELETE'])
@jwt_required()
def clear_cart():
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({'error': 'Invalid User ID in Token'}), 401

    Cart.query.filter_by(user_id=user_id).delete()
    db.session.commit()

    return jsonify({'message': 'Cart cleared'}), 200