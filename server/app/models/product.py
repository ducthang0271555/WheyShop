from datetime import datetime
from tkinter.constants import CASCADE

from ..extensions import db

product_hashtags = db.Table('product_hashtags',
    db.Column('product_id', db.Integer, db.ForeignKey('products.id', ondelete=CASCADE), primary_key=True),
    db.Column('hashtag_id', db.Integer, db.ForeignKey('hash_tags.id', ondelete=CASCADE), primary_key=True)
)

product_gifts = db.Table('product_gifts',
    db.Column('product_id', db.Integer, db.ForeignKey('products.id', ondelete=CASCADE),primary_key=True),
    db.Column('gift_id', db.Integer, db.ForeignKey('gifts.id', ondelete=CASCADE), primary_key=True)
)

class Product(db.Model):
    __tablename__ = 'products'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    sku = db.Column(db.String(100), unique=True, nullable=True)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    brand_id = db.Column(db.Integer, db.ForeignKey('brands.id'), nullable=False)

    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    discount_percent = db.Column(db.Float, default=0.0)
    stock = db.Column(db.Integer, default=0)
    weight = db.Column(db.String(50), nullable=True)
    origin = db.Column(db.String(100), nullable=True)
    img_url = db.Column(db.String(255), nullable=True)

    rating = db.Column(db.Float, default=0.0)
    is_active = db.Column(db.Integer, default=1)
    is_new = db.Column(db.Integer, default=0)
    is_best_seller = db.Column(db.Integer, default=0)
    sold_count = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Quan hệ với Brand, Category, Flavor
    brand = db.relationship('Brand', backref='products', lazy=True)
    category = db.relationship('Category', backref='products', lazy=True)
    flavors = db.relationship('ProductFlavor', backref='product', lazy=True, cascade="all, delete-orphan")

    hashtags = db.relationship('HashTag', secondary=product_hashtags,
                               backref=db.backref('products', lazy='dynamic'))
    gifts = db.relationship('Gift', secondary=product_gifts,
                            backref=db.backref('products', lazy='dynamic'))

    def __repr__(self):
        return f'<Product {self.name}>'