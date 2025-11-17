from flask import Blueprint, request, jsonify
from app.models import Brand
from app.extensions import db
from app.routes.decorator import admin_required

brand_bp = Blueprint('brands', __name__)

@brand_bp.route('/create-brand', methods=['POST'])
@admin_required
def create_brand():
    data = request.get_json()
    name = data.get('name')

    if not name:
        return jsonify({'error': 'Brand name is required'}), 400

    new_brand = Brand(name=name)
    db.session.add(new_brand)
    db.session.commit()

    return jsonify({
        'message': 'Brand created successfully',
        'brand': new_brand.name
    }), 201

@brand_bp.route('/get-all-brands', methods=['GET'])
def get_all_brands():
    brands = Brand.query.all()
    brand_list = [{'id': brand.id, 'name': brand.name} for brand in brands]
    return jsonify({'brands': brand_list}), 200

@brand_bp.route('/get-brand/<int:brand_id>', methods=['GET'])
def get_brand(brand_id):
    brand = Brand.query.get(brand_id)

    if not brand:
        return jsonify({'error': 'Brand not found'}), 404

    return jsonify({'id': brand_id, 'name': brand.name}), 200

@brand_bp.route('/update-brand/<int:brand_id>', methods=['PUT'])
@admin_required
def update_brand(brand_id):
    brand = Brand.query.get(brand_id)

    if not brand:
        return jsonify({'error': 'Brand not found'}), 404

    data = request.get_json()
    name = data.get('name')

    if not name:
        return jsonify({'error': 'Brand name is required'}), 400

    brand.name = name
    db.session.commit()

    return jsonify({'message': 'Brand updated successfully'}), 200

@brand_bp.route('/delete-brand/<int:brand_id>', methods=['DELETE'])
@admin_required
def delete_brand(brand_id):
    brand = Brand.query.get(brand_id)

    if not brand:
        return jsonify({'error': 'Brand not found'}), 404

    db.session.delete(brand)
    db.session.commit()

    return jsonify({'message': 'Brand deleted successfully'}), 200
