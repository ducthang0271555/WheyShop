from flask import Blueprint, request, jsonify
from app.models import Product, Category, HashTag, Gift
from app.extensions import db
from app.routes.decorator import admin_required
from app.utils.image_utils import save_image, delete_image_if_unused

product_bp = Blueprint('products', __name__)


def get_objects_by_ids(model_class, id_list):
    if not id_list:
        return []

    valid_ids = set()
    for item_id in id_list:
        if item_id and str(item_id).strip():
            try:
                valid_ids.add(int(item_id))
            except ValueError:
                continue

    if not valid_ids:
        return []

    return db.session.query(model_class).filter(model_class.id.in_(valid_ids)).all()

@product_bp.route('/create-product', methods=['POST'])
@admin_required
def create_product():
    sku = request.form.get('sku')
    name = request.form.get('name')
    description = request.form.get('description')
    origin = request.form.get('origin')
    weight = request.form.get('weight')

    cat_id_str = request.form.get('category_id')
    brand_id_str = request.form.get('brand_id')
    price_str = request.form.get('price')
    stock_str = request.form.get('stock')

    discount_str = request.form.get('discount_percent', '0')
    is_new_str = request.form.get('is_new', '0')

    hash_tags_ids = request.form.getlist('hash_tags')
    gift_ids = request.form.getlist('gifts')

    img_file = request.files.get('image')

    required_fields = [sku, name, origin, weight, cat_id_str, brand_id_str, price_str, stock_str]
    if any(f is None or str(f).strip() == "" for f in required_fields):
        return jsonify({"message": "Missing required fields"}), 400

    if Product.query.filter_by(sku=sku).first():
        return jsonify({"message": "SKU already exists"}), 400

    try:
        category_id = int(cat_id_str)
        brand_id = int(brand_id_str)
        stock = int(stock_str)
        is_new = int(is_new_str)

        price = float(price_str)
        discount_percent = float(discount_str)

        if price < 0 or stock < 0 or discount_percent < 0:
            return jsonify({"error": "Price, stock, and discount must be non-negative"}), 400
    except ValueError:
        return jsonify({"error": "Invalid format for numeric fields"}), 400

    img_url = save_image(img_file, "product_image")

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
        img_url=img_url,
        is_new=is_new
    )

    if hash_tags_ids:
        new_product.hashtags = get_objects_by_ids(HashTag, hash_tags_ids)

    if gift_ids:
        new_product.gifts = get_objects_by_ids(Gift, gift_ids)

    db.session.add(new_product)
    db.session.commit()

    return jsonify({"message": "Product created successfully"}), 201


@product_bp.route('/get-all-products', methods=['GET'])
@admin_required
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
                    'is_best_seller': product.is_best_seller, 'img_url': product.img_url,
                    'is_new': product.is_new, 'hashtags': [{'id': tag.id, 'name': tag.name} for tag in product.hashtags],
                    'gifts': [{'id': gift.id, 'name': gift.name} for gift in product.gifts]}

    return jsonify({'product': product_data}), 200

@product_bp.route('/get-product-public/<int:product_id>', methods=['GET'])
def get_product_public(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"error": "Product not found"}), 404

    flavors_list = []
    for f in product.flavors:
        flavors_list.append({
            'id': f.id,
            'name': f.flavor_name,
            'price': float(f.price),
            'stock': f.stock,
            'image': f.image_url
        })

    gifts_list = []
    for g in product.gifts:
        gifts_list.append({
            'id': g.id,
            'name': g.name,
            'image': g.image_url
        })

    product_data = {
        'id': product.id,
        'sku': product.sku,
        'name': product.name,
        'description': product.description,
        'price': float(product.price),
        'discount_percent': product.discount_percent,
        'price_after_discount': float(product.price) * (1 - product.discount_percent / 100),
        'stock': product.stock,
        'weight': product.weight,
        'origin': product.origin,
        'rating': product.rating,
        'sold_count': product.sold_count,
        'is_new': product.is_new,
        'is_best_seller': product.is_best_seller,
        'img_url': product.img_url,
        'category_id': product.category_id,
        'category_name': product.category.name if product.category else "Đang cập nhật",

        'brand_id': product.brand_id,
        'brand_name': product.brand.name if product.brand else "Đang cập nhật",
        'flavors': flavors_list,
        'gifts': gifts_list
    }

    return jsonify({'product': product_data}), 200



@product_bp.route('/update-product/<int:product_id>', methods=['PUT'])
@admin_required
def update_product(product_id):
    product = Product.query.get(product_id)

    if not product:
        return jsonify({'error': 'Product not found'}), 404

    data = request.form

    sku = data.get('sku')
    name = data.get('name')
    origin = data.get('origin')
    weight = data.get('weight')
    description = data.get('description')

    category_id_str = data.get('category_id')
    brand_id_str = data.get('brand_id')
    price_str = data.get('price')
    stock_str = data.get('stock')

    discount_str = data.get('discount_percent', '0')
    is_active_str = data.get('is_active', '1')
    is_best_seller_str = data.get('is_best_seller', '0')
    is_new_str = data.get('is_new', '0')

    hash_tags_ids = request.form.getlist('hash_tags')
    gift_ids = request.form.getlist('gifts')

    img_file = request.files.get('image')

    if not all([sku, name, origin, weight, category_id_str, brand_id_str, price_str, stock_str]):
        return jsonify({'error': 'Missing required fields'}), 400

    # SKU conflict logic
    existing_sku = Product.query.filter(
        Product.sku == sku,
        Product.id != product_id
    ).first()

    if existing_sku:
        return jsonify({'error': 'SKU already exists'}), 400

    try:
        category_id = int(category_id_str)
        brand_id = int(brand_id_str)
        stock = int(stock_str)
        is_active = int(is_active_str)
        is_best_seller = int(is_best_seller_str)
        is_new = int(is_new_str)

        price = float(price_str)
        discount_percent = float(discount_str)

        if price < 0 or stock < 0 or discount_percent < 0:
            return jsonify({"error": "Price, stock, and discount must be non-negative"}), 400
    except ValueError:
        return jsonify({"error": "Invalid format for numeric fields"}), 400

    if img_file:
        new_img_url = save_image(img_file, "product_image")
        old_img_url = product.img_url
        if old_img_url and old_img_url != new_img_url:
            delete_image_if_unused(old_img_url, Product, exclude_id=product_id)

        product.img_url = new_img_url

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
    product.is_new = is_new

    product.hashtags = get_objects_by_ids(HashTag, hash_tags_ids)
    product.gifts = get_objects_by_ids(Gift, gift_ids)

    db.session.commit()

    return jsonify({'message': "Product updated successfully"}), 200




@product_bp.route('/delete-product/<int:product_id>', methods=['DELETE'])
@admin_required
def delete_product(product_id):
    product = Product.query.get(product_id)

    if not product:
        return jsonify({'error': 'Product not found'}), 404

    img_url = product.img_url

    db.session.delete(product)
    db.session.commit()

    if img_url:
        delete_image_if_unused(img_url, Product)

    return jsonify({'message': 'Product deleted successfully'}), 200

@product_bp.route('/flash-sale', methods=['GET'])
def get_flash_sale_products():
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 10, type=int)

    sort_by = request.args.get('sort', 'default')
    cat_filter = request.args.get('category_filter', '')

    query = Product.query.filter(
        Product.discount_percent > 0,
        Product.is_active == 1
    )

    if cat_filter:
        cat_ids = [int(cid) for cid in cat_filter.split(',') if cid.isdigit()]
        if cat_ids:
            query = query.filter(Product.category_id.in_(cat_ids))

    if sort_by == 'price_asc':
        query = query.order_by(Product.price.asc())
    elif sort_by == 'price_desc':
        query = query.order_by(Product.price.desc())
    else:
        query = query.order_by(Product.sold_count.desc())

    pagination = query.paginate(page=page, per_page=limit, error_out=False)
    products = pagination.items

    result = []
    for p in products:
        result.append({
            'id': p.id,
            'category_id': p.category_id,
            'name': p.name,
            'price': float(p.price),
            'discount_percent': p.discount_percent,
            'rating': p.rating,
            'sold_count': p.sold_count,
            'image': p.img_url,
            'is_new': p.is_new
        })

    return jsonify({
        'products': result,
        'hashtag': 'Flash Sale Giá Sốc',
        'pagination': {
            'total_items': pagination.total,
            'total_pages': pagination.pages,
            'current_page': page,
            'per_page': limit,
            'has_next': pagination.has_next,
            'has_prev': pagination.has_prev
        }
    }), 200

@product_bp.route('search', methods=['GET'])
def search_products():
    keyword = request.args.get('q', '').strip()

    if not keyword:
        return jsonify({'products': []}), 200

    products = Product.query.filter(Product.name.ilike(f'%{keyword}%'), Product.is_active == 1) \
        .order_by(Product.sold_count.desc()) \
        .limit(10).all()

    results = []

    for p in products:
        final_price = float(p.price) * (1 - p.discount_percent / 100) if p.discount_percent > 0 else float(p.price)

        results.append({
            'id': p.id,
            'name': p.name,
            'image': p.img_url,
            'original_price': float(p.price),
            'final_price': round(final_price, 2),
            'discount_percent': p.discount_percent
        })

    return jsonify(results), 200

@product_bp.route('/new-products', methods=['GET'])
def get_new_products():
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', type=int)
    sort_by = request.args.get('sort', 'default')
    cat_filter = request.args.get('category_filter', '')

    query = Product.query.filter(
        Product.is_new == 1,
        Product.is_active == 1
    )

    if cat_filter:
        cat_ids = [int(cid) for cid in cat_filter.split(',') if cid.isdigit()]
        if cat_ids:
            query = query.filter(Product.category_id.in_(cat_ids))

    if sort_by == 'price_asc':
        query = query.order_by(Product.price.asc())
    elif sort_by == 'price_desc':
        query = query.order_by(Product.price.desc())
    else:
        query = query.order_by(Product.created_at.desc())

    if limit:
        pagination = query.paginate(page=page, per_page=limit, error_out=False)
        products = pagination.items

        pagination_meta = {
            'total_items': pagination.total,
            'total_pages': pagination.pages,
            'current_page': page,
            'per_page': limit,
            'has_next': pagination.has_next,
            'has_prev': pagination.has_prev
        }
    else:
        products = query.all()
        pagination_meta = None

    result = []
    for p in products:
        result.append({
            'id': p.id,
            'category_id': p.category_id,
            'name': p.name,
            'price': float(p.price),
            'discount_percent': p.discount_percent,
            'rating': p.rating,
            'sold_count': p.sold_count,
            'image': p.img_url,
            'is_new': p.is_new
        })

    return jsonify({
        'products': result,
        'hashtag': 'Sản phẩm mới về',
        'pagination': pagination_meta
    }), 200


@product_bp.route('/hashtag/<int:id>', methods=['GET'])
def get_products_by_hashtag(id):
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', type=int)
    sort_by = request.args.get('sort', 'default')

    tag = HashTag.query.get(id)

    if not tag:
        return jsonify({'message': 'Hashtag not found', 'products': []}), 404

    query = Product.query.filter(
        Product.hashtags.any(id=id),
        Product.is_active == 1
    )

    if sort_by == 'price_asc':
        query = query.order_by(Product.price.asc())
    elif sort_by == 'price_desc':
        query = query.order_by(Product.price.desc())
    else:
        query = query.order_by(Product.sold_count.desc())


    if limit:
        pagination = query.paginate(page=page, per_page=limit, error_out=False)
        products = pagination.items

        pagination_meta = {
            'total_items': pagination.total,
            'total_pages': pagination.pages,
            'current_page': page,
            'per_page': limit,
            'has_next': pagination.has_next,
            'has_prev': pagination.has_prev
        }
    else:
        products = query.all()
        pagination_meta = None

    result = []
    for p in products:
        result.append({
            'id': p.id,
            'name': p.name,
            'price': float(p.price),
            'discount_percent': p.discount_percent,
            'rating': p.rating,
            'sold_count': p.sold_count,
            'image': p.img_url,
            'is_new': p.is_new
        })

    return jsonify({
        'products': result,
        'hashtag': tag.name,
        'pagination': pagination_meta
    }), 200

@product_bp.route('/products-by-category/<int:category_id>', methods=['GET'])
def get_products_by_category(category_id):
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', type=int)
    sort_by = request.args.get('sort', 'default')

    query = Product.query.filter_by(
        category_id=category_id,
        is_active=1
    )

    if sort_by == 'price_asc':
        query = query.order_by(Product.price.asc())
    elif sort_by == 'price_desc':
        query = query.order_by(Product.price.desc())
    else:
        query = query.order_by(Product.sold_count.desc())

    if limit:
        pagination = query.paginate(page=page, per_page=limit, error_out=False)
        products = pagination.items

        pagination_meta = {
            'total_items': pagination.total,
            'total_pages': pagination.pages,
            'current_page': page,
            'per_page': limit,
            'has_next': pagination.has_next,
            'has_prev': pagination.has_prev
        }
    else:
        products = query.all()
        pagination_meta = None

    result = []
    for p in products:
        result.append({
            'id': p.id,
            'name': p.name,
            'image': p.img_url,
            'price': float(p.price),
            'discount_percent': p.discount_percent,
            'sold_count': p.sold_count,
            'rating': p.rating,
            'is_new': p.is_new
        })

    return jsonify({
        'products': result,
        'pagination': pagination_meta
    }), 200