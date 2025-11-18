from marshmallow import Schema, fields, validate, validates, ValidationError, validates_schema
from app.models import User
import re

USERNAME_REGEX = r"^[a-zA-Z0-9_.-]{3,30}$"

class RegisterSchema(Schema):
    username = fields.String(required=True, validate=validate.Length(min=5, max=30))
    password = fields.String(required=True, validate=validate.Length(min=8))
    email = fields.Email(required=True)

    @validates('username')
    def validate_username(self, value, **kwargs):
        if User.query.filter_by(username=value).first():
            raise ValidationError('Username already exists.')

    @validates('email')
    def validate_email(self, value, **kwargs):
        if User.query.filter_by(email=value).first():
            raise ValidationError('Email already exists.')

class LoginSchema(Schema):
    username = fields.String(required=True, validate=validate.Length(min=5, max=30))
    password = fields.String(required=True, validate=validate.Length(min=8))

class ChangePasswordSchema(Schema):
    old_password = fields.String(required=True, validate=validate.Length(min=8))
    new_password = fields.String(required=True, validate=validate.Length(min=8))
    confirm_password = fields.String(required=True, validate=validate.Length(min=8))

    @validates_schema
    def validate_passwords(self, data, **kwargs):
        new_password = data.get('new_password')
        confirm_password = data.get('confirm_password')

        if new_password != confirm_password:
            raise ValidationError('Mật khẩu mới và xác nhận mật khẩu không giống nhau.', 'confirm_password')

        if new_password and len(new_password) < 8:
            raise ValidationError("Mật khẩu phải từ 8 ký tự trở lên.", "new_password")


class UsernameSchema(Schema):
    username = fields.String(
        required=True,
        validate=validate.Length(min=3, max=30),
        error_messages={
            "required": "Vui lòng nhập tên tài khoản",
            "validator_failed": "Tên tài khoản phải từ 3–30 ký tự"
        }
    )

    @validates("username")
    def validate_username_format(self, value, **kwargs):
        if not re.match(USERNAME_REGEX, value):
            raise ValidationError(
                "Tên tài khoản không hợp lệ. Chỉ chứa chữ, số, ., -, _, 3–30 ký tự."
            )

        if not User.query.filter_by(username=value).first():
            raise ValidationError("Tên tài khoản không tồn tại.")

class ResetPasswordSchema(Schema):
    new_password = fields.String(required=True, validate=validate.Length(min=8))
    confirm_password = fields.String(required=True, validate=validate.Length(min=8))

    @validates_schema
    def validate_passwords(self, data, **kwargs):
        if data.get("new_password") != data.get("confirm_password"):
            raise ValidationError("Mật khẩu mới và xác nhận mật khẩu không khớp.", "confirm_password")