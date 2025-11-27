from flask import Blueprint, request, jsonify
from app.models import HashTag
from app.extensions import db
from app.routes.decorator import admin_required

hash_tag_bp = Blueprint('hash_tags', __name__)

@hash_tag_bp.route('/create-hash-tag', methods=['POST'])
@admin_required
def create_hash_tag():
    name = request.form.get('name')
    img_file = request.files.get('image')
    img_url = None

    if not name:
        return jsonify({'error': 'Hash tag name is required'}), 400

    if HashTag.query.filter_by(name=name).first():
        return jsonify({'error': 'Hash tag name already exists'}), 400

    if img_file:
        import os
        from werkzeug.utils import secure_filename

        UPLOAD_FOLDER = "static/images/hash_tag_image/"
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)

        filename = secure_filename(img_file.filename)
        file_path = os.path.join(UPLOAD_FOLDER, filename)

        # Nếu file đã tồn tại → KHÔNG lưu lại nữa
        if not os.path.exists(file_path):
            img_file.save(file_path)

        img_url = f"{UPLOAD_FOLDER}{filename}"

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

    new_img_url = hash_tag.image_url
    old_img_url = hash_tag.image_url

    if img_file:
        import os
        from werkzeug.utils import secure_filename

        UPLOAD_FOLDER = "static/images/hash_tag_image/"
        filename = secure_filename(img_file.filename)
        new_path = os.path.join(UPLOAD_FOLDER, filename)

        # Ảnh mới chưa tồn tại → lưu
        if not os.path.exists(new_path):
            img_file.save(new_path)

        new_img_url = f"{UPLOAD_FOLDER}{filename}"

        # Nếu ảnh cũ khác ảnh mới → check xem còn ai dùng không
        if old_img_url and old_img_url != new_img_url:
            used_by_other = HashTag.query.filter(
                HashTag.image_url == old_img_url,
                HashTag.id != hash_tag_id
            ).first()

            # Không ai dùng → xóa file
            if not used_by_other:
                old_path = old_img_url
                if os.path.exists(old_path):
                    try:
                        os.remove(old_path)
                    except:
                        pass

    hash_tag.name = name
    hash_tag.image_url = new_img_url

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

    # Kiểm tra xem còn ai dùng ảnh này không
    if img_url:
        used_by_other = HashTag.query.filter(
            HashTag.image_url == img_url
        ).first()

        # Không ai dùng → xóa file
        if not used_by_other:
            import os
            file_path = img_url
            if os.path.exists(file_path):
                try:
                    os.remove(file_path)
                except:
                    pass

    db.session.commit()

    return jsonify({'message': 'Hash tag deleted successfully'}), 200