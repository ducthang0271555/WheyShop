from flask import Blueprint, request, jsonify
from app.models import Product, Category
from app.extensions import db

product_bp = Blueprint('products', __name__)

@product_bp.route('/create-product', methods=['POST'])
def create_product():
    # Lấy dữ liệu từ form
    sku = request.form.get('sku')
    category_id = request.form.get('category_id')
    name = request.form.get('name')
    brand_id = request.form.get('brand_id')
    description = request.form.get('description')
    price = request.form.get('price')
    stock = request.form.get('stock')
    weight = request.form.get('weight')
    origin = request.form.get('origin')
    discount_percent = request.form.get('discount_percent', 0)

    # Lấy file ảnh từ form
    img_file = request.files.get('image')
    img_url = None

    if img_file:
        import os
        from werkzeug.utils import secure_filename

        UPLOAD_FOLDER = "static/images/product_image/"
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)

        filename = secure_filename(img_file.filename)
        file_path = os.path.join(UPLOAD_FOLDER, filename)

        # ✅ Nếu file đã tồn tại → KHÔNG lưu lại nữa
        if not os.path.exists(file_path):
            img_file.save(file_path)

        img_url = f"{UPLOAD_FOLDER}{filename}"

    # Kiểm tra thiếu field
    if not all([category_id, sku, stock, weight, origin, name, brand_id, price, discount_percent]):
        return jsonify({"message": "Missing required fields"}), 400

    # Kiểm tra SKU tồn tại
    if Product.query.filter_by(sku=sku).first():
        return jsonify({"message": "SKU already exists"}), 400

    # Convert dữ liệu
    category_id = int(category_id)
    stock = int(stock)
    brand_id = int(brand_id)
    price = float(price)
    discount_percent = float(discount_percent)

    new_product = Product(
        sku=sku,
        category_id=category_id,
        name=name,
        brand_id=brand_id,
        price=price,
        stock=stock,
        weight=weight,
        origin=origin,
        discount_percent=float(discount_percent),
        description=description,
        img_url=img_url
    )

    db.session.add(new_product)
    db.session.commit()

    return jsonify({"message": "Product created successfully"}), 201


@product_bp.route('/get-all-products', methods=['GET'])
def get_all_products():
    categories = Category.query.all()
    result = []
    for c in categories:
        products = Product.query.filter_by(category_id=c.id).all()
        product_lists =[]
        for p in products:
            product_lists.append({
                'id': p.id, 'category_id': p.category_id, 'name': p.name, 'description': p.description,
                'price': str(p.price), 'stock': p.stock, 'sku': p.sku, 'brand_id': p.brand_id,
                'discount_percent': p.discount_percent, 'weight': p.weight, 'origin': p.origin,
                'rating': p.rating, 'sold_count': p.sold_count, 'image': p.img_url
            })
        result.append({
            'category_id': c.id,
            'category_name': c.name,
            'products': product_lists
        })

    return jsonify(result), 200

@product_bp.route('/get-product/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = Product.query.get(product_id)

    if not product:
        return jsonify({'message': 'Product not found'}), 404

    product_data = {'id': product.id, 'category_id': product.category_id, 'name': product.name,
                    'description': product.description, 'price': str(product.price), 'stock': product.stock,
                    'sku': product.sku, 'brand_id': product.brand_id, 'discount_percent': product.discount_percent,
                    'weight': product.weight, 'origin': product.origin, 'rating': product.rating,
                    'sold_count': product.sold_count, 'is_active': product.is_active,
                    'is_best_seller': product.is_best_seller, 'img_url': product.img_url}

    return jsonify({'product': product_data}), 200

@product_bp.route('/update-product/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    product = Product.query.get(product_id)

    if not product:
        return jsonify({'error': 'Product not found'}), 404

    # ✅ LẤY DỮ LIỆU TỪ FORMDATA — KHÔNG PHẢI JSON
    data = request.form
    img_file = request.files.get('image')

    # Lấy field
    sku = data.get('sku')
    category_id = data.get('category_id')
    name = data.get('name')
    description = data.get('description')
    price = data.get('price')
    stock = data.get('stock')
    brand_id = data.get('brand_id')
    discount_percent = data.get('discount_percent')
    weight = data.get('weight')
    origin = data.get('origin')
    is_active = data.get('is_active')
    is_best_seller = data.get('is_best_seller')

    # Check missing
    required = [
        sku, category_id, name, price, stock,
        brand_id, discount_percent, weight,
        origin, is_active, is_best_seller
    ]

    if any(x is None or x == "" for x in required):
        return jsonify({'error': 'Missing required field'}), 400

    # SKU conflict
    existing_sku = Product.query.filter(
        Product.sku == sku,
        Product.id != product_id
    ).first()

    if existing_sku:
        return jsonify({'error': 'SKU already exists'}), 400

    # Convert types
    category_id = int(category_id)
    stock = int(stock)
    brand_id = int(brand_id)
    discount_percent = float(discount_percent)
    price = float(price)
    is_active = int(is_active) == 1
    is_best_seller = int(is_best_seller) == 1

    # ==========================
    # ✅ HANDLE IMAGE
    # ==========================

    upload_folder = "static/images/product_image/"
    new_img_url = product.img_url
    old_img_url = product.img_url

    if img_file:
        import os
        from werkzeug.utils import secure_filename

        filename = secure_filename(img_file.filename)
        new_path = os.path.join(upload_folder, filename)

        # ✅ 1. Ảnh mới chưa tồn tại → lưu
        if not os.path.exists(new_path):
            img_file.save(new_path)

        new_img_url = f"{upload_folder}{filename}"

        # ✅ 2. Nếu ảnh cũ khác ảnh mới → check xem còn ai dùng không
        if old_img_url and old_img_url != new_img_url:
            used_by_other = Product.query.filter(
                Product.img_url == old_img_url,
                Product.id != product_id
            ).first()

            # Không ai dùng → xóa file
            if not used_by_other:
                old_path = old_img_url
                if os.path.exists(old_path):
                    try:
                        os.remove(old_path)
                    except:
                        pass

    # ==========================
    # ✅ SAVE DATABASE
    # ==========================
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
    product.img_url = new_img_url

    db.session.commit()

    return jsonify({'message': "Product updated successfully"}), 200




@product_bp.route('/delete-product/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    product = Product.query.get(product_id)

    if not product:
        return jsonify({'error': 'Product not found'}), 404

    db.session.delete(product)
    db.session.commit()

    return jsonify({'message': 'Product deleted successfully'}), 200