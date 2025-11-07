from ..extensions import db
from sqlalchemy import Numeric

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(30), nullable=False, unique=True)
    email = db.Column(db.String(120), nullable=False, unique=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.Integer, default=0)  # 0: customer, 1: admin
    total_spent = db.Column(Numeric(10, 2), default=0)

    orders = db.relationship('Order', backref='user', lazy=True)
    cart_items = db.relationship('Cart', backref='user', lazy=True)

    def __repr__(self):
        return f'<User {self.username}>'
