from ..extensions import db

class Cart(db.Model):
    __tablename__ = 'carts'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)

    flavor_id = db.Column(db.Integer, db.ForeignKey('product_flavors.id'), nullable=True)
    gift_id = db.Column(db.Integer, db.ForeignKey('gifts.id'), nullable=True)

    quantity = db.Column(db.Integer, default=1)
    created_at = db.Column(db.DateTime, default=db.func.now())

    product = db.relationship('Product', backref='cart_items', lazy=True)
    flavor = db.relationship('ProductFlavor', backref='cart_items', lazy=True)
    gift = db.relationship('Gift', backref='cart_items', lazy=True)

    def __repr__(self):
        return f'<Cart user={self.user_id} product={self.product_id}>'
