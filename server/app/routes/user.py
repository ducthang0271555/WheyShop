from datetime import timedelta
import json
from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.models import User
from app.routes.schemas.user_schema import RegisterSchema, LoginSchema, ChangePasswordSchema
from marshmallow import ValidationError
from app.extensions import limiter
from app.extensions import db
from app.routes.decorator import admin_required

register_schema = RegisterSchema()
login_schema = LoginSchema()
change_password_schema = ChangePasswordSchema()

user_bp = Blueprint('users', __name__)

@user_bp.route('/register', methods=['POST'])
@limiter.limit("10 per 5 minute")
def register():
    try:
        data = register_schema.load(request.get_json())
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400

    password_hash = generate_password_hash(data['password'])

    new_user = User(
        username=data['username'],
        password_hash=password_hash,
        email=data['email']
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201

@user_bp.route('/login', methods=['POST'])
@limiter.limit("10 per 5 minutes")
def login():
    try:
        data = login_schema.load(request.get_json())
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400

    username = data['username']
    password = data['password']

    user = User.query.filter_by(username=username).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({'error': 'Invalid username or password'}), 401

    access_token = create_access_token(
        identity=json.dumps({
            'id': user.id,
            'username': user.username,
            'role': user.role
        }),
        expires_delta=timedelta(minutes=30)
    )


    return jsonify({'access_token': access_token, 'role': user.role}), 200

@user_bp.route('/dashboard', methods=['GET'])
@jwt_required()
def dashboard():
    identity_str = get_jwt_identity()
    current_user = json.loads(identity_str)  # convert lại dict
    return jsonify({
        'message': 'Success Authorization',
        'user': current_user
    }), 200

@user_bp.route('/get-all-users', methods=['GET'])
@admin_required
def get_all_users():
    users = User.query.all()
    users_data = [
        {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role,
            'total spent': user.total_spent
        } for user in users
    ]
    return jsonify(users_data), 200

@user_bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    identity_str = get_jwt_identity()
    current_user = json.loads(identity_str)

    try:
        data = change_password_schema.load(request.get_json())
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400

    user = User.query.get(current_user['id'])
    if not user:
        return jsonify({'error': 'User not found'}), 404

    if not check_password_hash(user.password_hash, data['old_password']):
        return jsonify({'error': 'Old password is incorrect'}), 400

    if check_password_hash(user.password_hash, data['new_password']):
        return jsonify({"error": "New password cannot be the same as old password"}), 400

    user.password_hash = generate_password_hash(data['new_password'])
    db.session.commit()

    return jsonify({'message': 'Password changed successfully'}), 200
