from datetime import timedelta
import json
from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.models import User
from app.extensions import db

user_bp = Blueprint('users', __name__)

@user_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')

    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'Username already exists'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already exists'}), 400

    password_hash = generate_password_hash(password)

    new_user = User(username=username, password_hash=password_hash, email=email)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201

@user_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400

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
def get_all_users():
    users = User.query.all()
    users_data = [{'id': user.id, 'username': user.username, 'email': user.email,'role': user.role, 'total spent': user.total_spent} for user in users]
    return jsonify(users_data), 200