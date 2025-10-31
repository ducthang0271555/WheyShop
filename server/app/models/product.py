from datetime import datetime
from ..extensions import db

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

    rating = db.Column(db.Float, default=0.0)
    is_active = db.Column(db.Boolean, default=True)
    is_best_seller = db.Column(db.Boolean, default=False)
    sold_count = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Quan hệ với Brand, Category, Flavor
    brand = db.relationship('Brand', backref='products', lazy=True)
    category = db.relationship('Category', backref='products', lazy=True)
    flavors = db.relationship('ProductFlavor', backref='product', lazy=True, cascade="all, delete-orphan")

    def __repr__(self):
        return f'<Product {self.name}>'