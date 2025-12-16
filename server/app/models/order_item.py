from ..extensions import db


class OrderItem(db.Model):
    __tablename__ = 'order_items'

    id = db.Column(db.Integer, primary_key=True)

    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)

    flavor_id = db.Column(db.Integer, db.ForeignKey('product_flavors.id'), nullable=True)
    gift_id = db.Column(db.Integer, db.ForeignKey('gifts.id'), nullable=True)
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)
    product_name = db.Column(db.String(255), nullable=False)
    flavor_name = db.Column(db.String(100), nullable=True)
    gift_name = db.Column(db.String(100), nullable=True)
    image_url = db.Column(db.String(255), nullable=True)

    product = db.relationship('Product', lazy=True)
    flavor = db.relationship('ProductFlavor', lazy=True)
    gift = db.relationship('Gift', lazy=True)

    order = db.relationship('Order', back_populates='items', lazy=True)

    def __repr__(self):
        return f'<OrderItem {self.product_name} - Qt: {self.quantity}>'