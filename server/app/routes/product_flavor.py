from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models import ProductFlavor
from app.routes.decorator import admin_required

product_flavor_bp = Blueprint('product_flavors', __name__)

@product_flavor_bp.route('/create-flavor/<int:product_id>', methods=['POST'])
@admin_required
def create_flavor(product_id):
    data = request.form
    product_id = product_id
    flavor_name = data.get('name')
    price = data.get('price')
    stock = data.get('stock')

    img_file = request.files.get('image')
    img_url = None

    if not all([flavor_name, price, stock, product_id]):
        return jsonify({"error": "Missing required fields"}), 400

    if img_file:
        import os
        from werkzeug.utils import secure_filename

        UPLOAD_FOLDER = "static/images/product_flavor_image/"
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)

        filename = secure_filename(img_file.filename)
        file_path = os.path.join(UPLOAD_FOLDER, filename)

        if not os.path.exists(file_path):
            img_file.save(file_path)

        img_url = f"{UPLOAD_FOLDER}{filename}"

    product_id = int(product_id)
    price = float(price)
    stock = int(stock)

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
    price = float(data.get('price'))
    stock = int(data.get('stock'))

    img_file = request.files.get('image')

    upload_folder = "static/images/product_flavor_image/"
    new_img_url = flavor.image_url
    old_img_url = flavor.image_url

    if not all([flavor_name, price, stock]):
        return jsonify({"error": "Missing required fields"}), 400

    if img_file:
        import os
        from werkzeug.utils import secure_filename

        filename = secure_filename(img_file.filename)
        new_path = os.path.join(upload_folder, filename)

        if not os.path.exists(new_path):
            img_file.save(new_path)

        new_img_url = f"{upload_folder}{filename}"

        if old_img_url and old_img_url != new_img_url:
            used_by_other = ProductFlavor.query.filter(
                ProductFlavor.image_url == old_img_url,
                ProductFlavor.id != flavor.id
            ).first()

            if not used_by_other:
                if os.path.exists(old_img_url):
                    try:
                        os.remove(old_img_url)
                    except:
                        pass

    flavor.name = flavor_name
    flavor.price = price
    flavor.stock = stock
    flavor.image_url = new_img_url

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

    if img_url:
        used_by_other = ProductFlavor.query.filter(ProductFlavor.image_url == img_url).first()

        if not used_by_other:
            import os
            file_path = img_url
            if os.path.exists(file_path):
                try:
                    os.remove(file_path)
                except:
                    pass

    db.session.commit()

    return jsonify({"message": "Deleted flavor successfully"}), 200