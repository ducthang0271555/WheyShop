from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models import ProductFlavor, Product
from app.routes.decorator import admin_required
from app.utils.image_utils import save_image, delete_image_if_unused

product_flavor_bp = Blueprint('product_flavors', __name__)

@product_flavor_bp.route('/create-flavor/<int:product_id>', methods=['POST'])
@admin_required
def create_flavor(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"error": "Product not found"}), 404

    data = request.form
    flavor_name = data.get('name')
    price = data.get('price')
    stock = data.get('stock')

    img_file = request.files.get('image')

    if not all([flavor_name, price, stock, product_id]):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        price = float(price)
        stock = int(stock)
        if price < 0 or stock < 0:
            return jsonify({"error": "Price and stock must be non-negative"}), 400
    except ValueError:
        return jsonify({"error": "Invalid price or stock format"}), 400

    img_url = save_image(img_file, "product_flavor_image")

    new_flavor = ProductFlavor(product_id=product_id, flavor_name=flavor_name, price=price, stock=stock, image_url=img_url)

    db.session.add(new_flavor)
    db.session.commit()

    return jsonify({"message": "Product flavor created successfully"}), 201

@product_flavor_bp.route('/get-flavors/<int:product_id>', methods=['GET'])
def get_flavors(product_id):
    flavors = ProductFlavor.query.filter_by(product_id=product_id).all()
    flavor_list = []
    for flavor in flavors:
        flavor_list.append({
            'id': flavor.id,
            'flavor_name': flavor.flavor_name,
            'price': flavor.price,
            'stock': flavor.stock,
            'image_url': flavor.image_url
        })

    return jsonify(flavor_list), 200

@product_flavor_bp.route('/get-flavor/<int:flavor_id>', methods=['GET'])
def get_flavor(flavor_id):
    flavor = ProductFlavor.query.get(flavor_id)
    if not flavor:
        return jsonify({"error": "Flavor not found"}), 404

    flavor_data = {
        'id': flavor.id,
        'flavor_name': flavor.flavor_name,
        'price': flavor.price,
        'stock': flavor.stock,
        'image_url': flavor.image_url
    }

    return jsonify(flavor_data), 200

@product_flavor_bp.route('/update-flavor/<int:flavor_id>', methods=['PUT'])
@admin_required
def update_flavor(flavor_id):
    flavor = ProductFlavor.query.get(flavor_id)

    if not flavor:
        return jsonify({"error": "Flavor not found"}), 404

    data = request.form
    flavor_name = data.get('name')
    price_str = data.get('price')
    stock_str = data.get('stock')

    if not flavor_name or price_str is None or stock_str is None:
        return jsonify({"error": "Missing required fields"}), 400

    try:
        price = float(price_str)
        stock = int(stock_str)
        if price < 0 or stock < 0:
            return jsonify({"error": "Price and stock must be non-negative"}), 400
    except ValueError:
        return jsonify({"error": "Invalid Price or stock format"}), 400

    img_file = request.files.get('image')
    old_img_url = flavor.image_url

    if img_file:
        new_img_url = save_image(img_file, "product_flavor_image")
        flavor.image_url = new_img_url

        if old_img_url and old_img_url != new_img_url:
            delete_image_if_unused(old_img_url, ProductFlavor, exclude_id=flavor_id)

    flavor.flavor_name = flavor_name
    flavor.price = price
    flavor.stock = stock

    db.session.commit()

    return jsonify({"message": "Product flavor updated successfully"}), 200

@product_flavor_bp.route('/delete-flavor/<flavor_id>', methods=['DELETE'])
@admin_required
def delete_flavor(flavor_id):
    flavor = ProductFlavor.query.get(flavor_id)

    if not flavor:
        return jsonify({"error": "Flavor not found"}), 404

    img_url = flavor.image_url

    db.session.delete(flavor)
    db.session.commit()

    if img_url:
        delete_image_if_unused(img_url, ProductFlavor)

    return jsonify({"message": "Deleted flavor successfully"}), 200