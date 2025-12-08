from flask import Blueprint, request, jsonify
from app.models import Gift
from app.extensions import db
from app.routes.decorator import admin_required
from app.utils.image_utils import save_image, delete_image_if_unused

gift_bp = Blueprint('gifts', __name__)

@gift_bp.route('/create-gift', methods=['POST'])
@admin_required
def create_gift():
    name = request.form.get('name')
    img_file = request.files.get('image')

    if not name:
        return jsonify({"error": "Gift name is required"}), 400

    img_url = save_image(img_file, "gift_image")

    new_gift = Gift(name=name, image_url=img_url)

    db.session.add(new_gift)
    db.session.commit()

    return jsonify({"message": "Gift create successfully!"}), 201

@gift_bp.route('/get-all-gifts', methods=['GET'])
def get_all_hash_tags():
    gifts = Gift.query.all()
    gift_list = [{'id': gift.id, 'name': gift.name, 'image_url': gift.image_url} for gift in gifts]
    return jsonify({'gifts': gift_list}), 200

@gift_bp.route('/update-gift/<int:gift_id>', methods=['PUT'])
@admin_required
def update_gift(gift_id):
    gift = Gift.query.get(gift_id)

    if not gift:
        return jsonify({'error': 'Gift not found'}), 404

    img_file = request.files.get('image')
    name = request.form.get('name')

    if not name:
        return jsonify({'error': 'Gift name is required'}), 400

    old_img_url = gift.image_url

    if img_file:
        new_img_url = save_image(img_file, "gift_image")
        gift.image_url = new_img_url

        # Kiểm tra và xóa ảnh cũ nếu không còn ai dùng
        if old_img_url and old_img_url != new_img_url:
            delete_image_if_unused(old_img_url, Gift, exclude_id=gift_id)

    gift.name = name

    db.session.commit()

    return jsonify({'message': "Gift updated successfully"}), 200

@gift_bp.route('/delete-gift/<int:gift_id>', methods=['DELETE'])
@admin_required
def delete_gift(gift_id):
    gift = Gift.query.get(gift_id)

    if not gift:
        return jsonify({'error': 'Gift not found'}), 404

    img_url = gift.image_url

    db.session.delete(gift)
    db.session.commit()

    # Kiểm tra xem còn ai dùng ảnh này không
    if img_url:
        delete_image_if_unused(img_url, Gift)

    return jsonify({'message': 'Gift deleted successfully'}), 200