from marshmallow import Schema, fields, validate, validates, ValidationError, validates_schema
from app.models import User

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
            raise ValidationError('New password and confirm password do not match.', 'confirm_password')

        if new_password and len(new_password) < 8:
            raise ValidationError("Password must be at least 8 characters.", "new_password")