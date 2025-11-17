from marshmallow import Schema, fields, validate, validates, ValidationError
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