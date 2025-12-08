from flask import Blueprint, request, jsonify
from app.models import HashTag
from app.extensions import db
from app.routes.decorator import admin_required
from app.utils.image_utils import save_image, delete_image_if_unused

hash_tag_bp = Blueprint('hash_tags', __name__)

@hash_tag_bp.route('/create-hash-tag', methods=['POST'])
@admin_required
def create_hash_tag():
    name = request.form.get('name')
    img_file = request.files.get('image')

    if not name:
        return jsonify({'error': 'Hash tag name is required'}), 400

    if HashTag.query.filter_by(name=name).first():
        return jsonify({'error': 'Hash tag name already exists'}), 400

    img_url = save_image(img_file, "hash_tag_image")


    new_hash_tag = HashTag(name=name, image_url=img_url)

    db.session.add(new_hash_tag)
    db.session.commit()

    return jsonify({"message": "Hash tag created successfully"}), 201

@hash_tag_bp.route('/get-all-hash-tags', methods=['GET'])
def get_all_hash_tags():
    hash_tags = HashTag.query.all()
    hash_tag_list = [{'id': ht.id, 'name': ht.name, 'image_url': ht.image_url} for ht in hash_tags]
    return jsonify({'hash_tags': hash_tag_list}), 200

@hash_tag_bp.route('/update-hash-tag/<int:hash_tag_id>', methods=['PUT'])
@admin_required
def update_hash_tag(hash_tag_id):
    hash_tag = HashTag.query.get(hash_tag_id)

    if not hash_tag:
        return jsonify({'error': 'Hash tag not found'}), 404

    img_file = request.files.get('image')
    name = request.form.get('name')

    if not name:
        return jsonify({'error': 'Hash tag name is required'}), 400

    old_img_url = hash_tag.image_url

    if img_file:
        new_img_url = save_image(img_file, "hash_tag_image")
        hash_tag.image_url = new_img_url

        if old_img_url and old_img_url != new_img_url:
            delete_image_if_unused(old_img_url, HashTag, exclude_id=hash_tag_id)

    hash_tag.name = name

    db.session.commit()

    return jsonify({'message': "Hash tag updated successfully"}), 200

@hash_tag_bp.route('/delete-hash-tag/<int:hash_tag_id>', methods=['DELETE'])
@admin_required
def delete_hash_tag(hash_tag_id):
    hash_tag = HashTag.query.get(hash_tag_id)

    if not hash_tag:
        return jsonify({'error': 'Hash tag not found'}), 404

    img_url = hash_tag.image_url

    db.session.delete(hash_tag)
    db.session.commit()

    # Kiểm tra xem còn ai dùng ảnh này không
    if img_url:
        delete_image_if_unused(img_url, HashTag)

    return jsonify({'message': 'Hash tag deleted successfully'}), 200