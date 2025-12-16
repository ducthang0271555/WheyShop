from datetime import datetime
from ..extensions import db

class Order(db.Model):
    __tablename__ = 'orders'

    id = db.Column(db.Integer, primary_key=True)
    order_code = db.Column(db.String(20), unique=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    payos_order_code = db.Column(db.BigInteger, unique=True, nullable=True)

    full_name = db.Column(db.String(100))
    phone = db.Column(db.String(20))
    address = db.Column(db.String(255))
    note = db.Column(db.Text)

    total_amount = db.Column(db.Float, nullable=False)

    status = db.Column(db.String(20), default='PENDING') # PENDING, PAID, CANCELLED
    payment_method = db.Column(db.String(20), default='COD')  # COD, BANK
    is_paid = db.Column(db.Boolean, default=False)


    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    items = db.relationship('OrderItem', back_populates='order', lazy=True)

    def __repr__(self):
        return f'<Order {self.id} - {self.status}>'