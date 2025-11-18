from datetime import timedelta, datetime
import json
from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from app.models import User, PasswordOTP
from app.routes.schemas.user_schema import RegisterSchema, LoginSchema, ChangePasswordSchema, UsernameSchema, ResetPasswordSchema
from marshmallow import ValidationError
from app.extensions import limiter
from app.extensions import db
from app.routes.decorator import admin_required
from app.utils.otp_utils import generate_otp_code, hash_otp, send_otp_email

register_schema = RegisterSchema()
login_schema = LoginSchema()
change_password_schema = ChangePasswordSchema()
forgot_password_schema = UsernameSchema()
resend_otp_schema = UsernameSchema()
reset_password_schema = ResetPasswordSchema()

OTP_LENGTH = 6
OTP_EXPIRE_MINUTES = 1
OTP_RESEND_COOLDOWN_SECONDS = 60
MAX_RESEND_PER_WINDOW = 5

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
        return jsonify({'error': err.messages}), 400

    user = User.query.get(current_user['id'])
    if not user:
        return jsonify({'error': 'User not found'}), 404

    if not check_password_hash(user.password_hash, data['old_password']):
        return jsonify({'error': 'Mật khẩu hiện tại không chính xác!'}), 400

    if check_password_hash(user.password_hash, data['new_password']):
        return jsonify({"error": "Mật khẩu mới phải khác mật khẩu hiện tại!"}), 400

    user.password_hash = generate_password_hash(data['new_password'])
    db.session.commit()

    return jsonify({'message': 'Password changed successfully'}), 200

@user_bp.route('/forgot-password', methods=['POST'])
@limiter.limit("10 per 10 minutes")
def forgot_password():
    data = request.get_json() or {}

    # Validate bằng Marshmallow
    try:
        validated = forgot_password_schema.load(data)
    except ValidationError as err:
        return jsonify({"error": err.messages}), 400

    username = validated["username"]
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({"error": "Tài khoản không tồn tại"}), 400

    now = datetime.utcnow()

    # đánh dấu tất cả OTP chưa dùng trước đó thành used = 1
    unused_otps = PasswordOTP.query.filter_by(user_id=user.id, used=0).all()
    for otp_rec in unused_otps:
        otp_rec.used = 1
    db.session.commit()

    # Kiểm tra OTP gần nhất
    recent = PasswordOTP.query.filter_by(user_id=user.id).order_by(PasswordOTP.id.desc()).first()
    if recent and recent.used == 0 and recent.resend_available_at > now:
        cooldown_seconds = int((recent.resend_available_at - now).total_seconds())
        return jsonify({
            "message": "OTP đã được gửi gần đây. Vui lòng thử lại sau.",
            "retry_after": cooldown_seconds
        }), 429  # Too Many Requests

    # Generate OTP mới
    otp = generate_otp_code(OTP_LENGTH)
    otp_hash = hash_otp(otp)
    expires_at = now + timedelta(minutes=OTP_EXPIRE_MINUTES)
    resend_available_at = now + timedelta(seconds=OTP_RESEND_COOLDOWN_SECONDS)

    new_rec = PasswordOTP(
        user_id=user.id,
        otp_hash=otp_hash,
        created_at=now,
        expires_at=expires_at,
        resend_available_at=resend_available_at,
        used=0,  # chưa dùng
        attempts=0,
        resend_count=(recent.resend_count + 1) if recent else 0
    )

    db.session.add(new_rec)
    db.session.commit()

    # Gửi email OTP
    try:
        send_otp_email(user.email, otp, expires_minutes=OTP_EXPIRE_MINUTES)
    except Exception as e:
        current_app.logger.exception("Failed to send OTP email")
        return jsonify({"error": "Gửi email thất bại, vui lòng thử lại sau."}), 500

    return jsonify({
        "message": "OTP đã được gửi tới email của bạn.",
        "expires_in_minutes": OTP_EXPIRE_MINUTES
    }), 200



@user_bp.route('/resend-otp', methods=['POST'])
@limiter.limit("8 per 10 minutes")
def resend_otp():
    data = request.get_json() or {}

    try:
        validated = resend_otp_schema.load(data)
    except ValidationError as err:
        return jsonify({"error": err.messages}), 400

    username = validated["username"]
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({"error": "Tài khoản không tồn tại"}), 400

    now = datetime.utcnow()

    # đánh dấu OTP trước đó chưa dùng thành used = 1
    unused_otps = PasswordOTP.query.filter_by(user_id=user.id, used=0).all()
    for otp_rec in unused_otps:
        otp_rec.used = 1
    db.session.commit()

    recent = PasswordOTP.query.filter_by(user_id=user.id).order_by(PasswordOTP.id.desc()).first()
    if not recent:
        return jsonify({"error": "Bạn chưa yêu cầu mã OTP lần đầu. Vui lòng bấm 'Quên mật khẩu'."}), 400

    if recent.resend_available_at > now:
        cooldown_seconds = int((recent.resend_available_at - now).total_seconds())
        return jsonify({
            "error": "Bạn vừa yêu cầu OTP gần đây.",
            "retry_after": cooldown_seconds
        }), 429

    if recent.resend_count >= MAX_RESEND_PER_WINDOW:
        return jsonify({
            "error": "Bạn đã yêu cầu gửi lại OTP quá nhiều lần. Vui lòng thử lại sau."
        }), 429

    # Tạo OTP mới
    otp = generate_otp_code(OTP_LENGTH)
    otp_hash = hash_otp(otp)
    expires_at = now + timedelta(minutes=OTP_EXPIRE_MINUTES)
    resend_available_at = now + timedelta(seconds=OTP_RESEND_COOLDOWN_SECONDS)

    new_rec = PasswordOTP(
        user_id=user.id,
        otp_hash=otp_hash,
        created_at=now,
        expires_at=expires_at,
        resend_available_at=resend_available_at,
        used=0,  # chưa dùng
        attempts=0,
        resend_count=recent.resend_count + 1
    )

    db.session.add(new_rec)
    db.session.commit()

    try:
        send_otp_email(user.email, otp, expires_minutes=OTP_EXPIRE_MINUTES)
    except Exception as e:
        current_app.logger.exception("Failed to send OTP email")
        return jsonify({"error": "Gửi email thất bại, vui lòng thử lại sau."}), 500

    return jsonify({
        "message": "OTP đã được gửi lại thành công.",
        "expires_in_minutes": OTP_EXPIRE_MINUTES
    }), 200


@user_bp.route('/verify-otp', methods=['POST'])
@limiter.limit("10 per 10 minutes")
def verify_otp():
    data = request.get_json() or {}
    username = data.get("username")
    otp_input = (data.get("otp") or "").strip()

    if not username or not otp_input:
        return jsonify({"error": "Invalid request"}), 400

    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({"error": "OTP không hợp lệ"}), 400

    # find latest unused otp record (used = 0)
    rec = PasswordOTP.query.filter_by(user_id=user.id, used=0).order_by(PasswordOTP.id.desc()).first()
    if not rec:
        return jsonify({"error": "OTP không hợp lệ hoặc đã hết hạn"}), 400

    now = datetime.utcnow()
    if rec.expires_at < now:
        rec.used = 1
        db.session.commit()
        return jsonify({"error": "OTP đã hết hạn"}), 400

    # compare hash
    if rec.otp_hash != hash_otp(otp_input):
        # increase attempts
        rec.attempts += 1
        db.session.commit()
        # optional: if too many attempts, mark used = 1
        if rec.attempts >= 5:
            rec.used = 1
            db.session.commit()
            return jsonify({"error": "OTP không hợp lệ"}), 400
        return jsonify({"error": "OTP không đúng"}), 400

    # OTP valid => mark used = 1 and issue reset token (short-lived JWT)
    rec.used = 1
    db.session.commit()

    reset_token = create_access_token(
        identity=str(user.id),  # chỉ dùng id hoặc json.dumps(dict)
        expires_delta=timedelta(minutes=10),
        additional_claims={"reset": True, "username": user.username}
    )

    return jsonify({"reset_token": reset_token}), 200



@user_bp.route('/reset-password', methods=['POST'])
@jwt_required()
def reset_password_with_token():
    claims = get_jwt()
    if not claims.get("reset"):
        return jsonify({"error": "Token không hợp lệ"}), 400

    user_id = int(get_jwt_identity())
    if not user_id:
        return jsonify({"error": "Token không hợp lệ"}), 400

    data = request.get_json() or {}

    try:
        validated = ResetPasswordSchema().load(data)
    except ValidationError as err:
        return jsonify({"error": err.messages}), 400

    new_password = validated["new_password"]

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    user.password_hash = generate_password_hash(new_password)
    db.session.commit()

    return jsonify({"message": "Đổi mật khẩu thành công"}), 200