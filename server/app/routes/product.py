from flask import Blueprint, request, jsonify
from app.models import Product
from app.extensions import db

product_bp = Blueprint('products', __name__)

@product_bp.route('/create-product', methods=['POST'])
def create_product():
    data = request.get_json()
    sku = data.get('sku')
    category_id = data.get('category_id')
    name = data.get('name')
    brand_id = data.get('brand_id')
    description = data.get('description')
    price = data.get('price')
    stock = data.get('stock')
    weight = data.get('weight')
    origin = data.get('origin')

    if not all([category_id, sku, stock, weight, origin, name, brand_id, price]):
        return jsonify({"message": "Missing required fields"}), 400

    existing_sku = Product.query.filter(Product.sku == sku).first()
    if existing_sku:
        return jsonify({"message": "SKU already exists"}), 400

    category_id, stock, brand_id = int(category_id), int(stock), int(brand_id)
    price = float(price)

    new_product = Product(sku=sku, category_id=category_id, name=name, brand_id=brand_id, price=price,
                          stock=stock, weight=weight, origin=origin, description=description)
    db.session.add(new_product)
    db.session.commit()

    return jsonify({"message": "Product created successfully"}), 201

@product_bp.route('/get-all-products', methods=['GET'])
def get_all_products():
    product = Product.query.all()
    product_list = [{'id': p.id, 'category_id': p.category_id, 'name': p.name, 'description': p.description,
                     'price': str(p.price), 'stock': p.stock, 'sku': p.sku, 'brand_id': p.brand_id,
                     'discount_percent': p.discount_percent, 'weight': p.weight, 'origin': p.origin,
                     'rating': p.rating, 'sold_count': p.sold_count} for p in product]

    return jsonify({'products': product_list}), 200

@product_bp.route('/get-product/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = Product.query.get(product_id)

    if not product:
        return jsonify({'message': 'Product not found'}), 404

    product_data = {'id': product.id, 'category_id': product.category_id, 'name': product.name,
                    'description': product.description, 'price': str(product.price), 'stock': product.stock,
                    'sku': product.sku, 'brand_id': product.brand_id, 'discount_percent': product.discount_percent,
                    'weight': product.weight, 'origin': product.origin, 'rating': product.rating,
                    'sold_count': product.sold_count}

    return jsonify({'product': product_data}), 200

@product_bp.route('/update-product/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    product = Product.query.get(product_id)

    if not product:
        return jsonify({'error':'Product not found'}), 404

    data = request.get_json()
    sku = data.get('sku')
    category_id = data.get('category_id')
    name = data.get('name')
    description =  data.get('description')
    price = data.get('price')
    stock = data.get('stock')
    brand_id = data.get('brand_id')
    discount_percent = data.get('discount_percent')
    weight = data.get('weight')
    origin = data.get('origin')
    is_active = data.get('is_active')
    is_best_seller = data.get('is_best_seller')

    required_keys = [
        sku, category_id, name, price,
        stock, brand_id, discount_percent, weight,
        origin, is_active, is_best_seller
    ]

    for key in required_keys:
        if key is None or key == "":
            return jsonify({'error': f'Missing required field: {key}'}), 400

    existing_sku = Product.query.filter(Product.sku == sku, Product.id != product_id).first()
    if existing_sku:
        return jsonify({'error': 'SKU already exists'}), 400

    category_id, stock, brand_id = int(category_id), int(stock), int(brand_id)
    discount_percent = float(discount_percent)
    is_active, is_best_seller = bool(is_active), bool(is_best_seller)

    product.sku = sku
    product.category_id = category_id
    product.name = name
    product.description = description
    product.price = price
    product.stock = stock
    product.brand_id = brand_id
    product.discount_percent = discount_percent
    product.weight = weight
    product.origin = origin
    product.is_active = is_active
    product.is_best_seller = is_best_seller

    db.session.commit()

    return jsonify({'message': 'Product updated successfully'}), 200

@product_bp.route('/delete-product/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    product = Product.query.get(product_id)

    if not product:
        return jsonify({'error': 'Product not found'}), 404

    db.session.delete(product)
    db.session.commit()

    return jsonify({'message': 'Product deleted successfully'}), 200