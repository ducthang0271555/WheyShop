from flask import Blueprint, request, jsonify
from app.models import Category
from app.extensions import db

category_bp = Blueprint('categories', __name__)

@category_bp.route('/create-category', methods=['POST'])
def create_category():
    data = request.get_json()
    name = data.get('name')

    if not name:
        return jsonify({'error': 'Category name is required'}), 400

    new_category = Category(name=name)
    db.session.add(new_category)
    db.session.commit()

    return jsonify({
        'message': 'Category created successfully',
        'category': new_category.name}), 201

@category_bp.route('/get-all-categories', methods=['GET'])
def get_all_categories():
    categories = Category.query.all()
    category_list = [{'id': category.id, 'name': category.name} for category in categories]
    return jsonify({'categories': category_list}), 200

@category_bp.route('/get-category/<int:category_id>', methods=['GET'])
def get_category(category_id):
    category = Category.query.get(category_id)

    if not category:
        return jsonify({'error': 'Category not found'}), 404

    return jsonify({'id': category_id, 'name': category.name}), 200

@category_bp.route('/update-category/<int:category_id>', methods=['PUT'])
def update_category(category_id):
    category = Category.query.get(category_id)

    if not category:
        return jsonify({'error': 'Category not found'}), 404

    data = request.get_json()
    name = data.get('name')

    if not name:
        return jsonify({'error': 'Category name is required'}), 400

    category.name = name
    db.session.commit()

    return jsonify({'message': 'Category updated successfully'}), 200

@category_bp.route('/delete-category/<int:category_id>', methods=['DELETE'])
def delete_category(category_id):
    category = Category.query.get(category_id)

    if not category:
        return jsonify({'error': 'Category not found'}), 404

    db.session.delete(category)
    db.session.commit()

    return jsonify({'message': 'Category deleted successfully'}), 200