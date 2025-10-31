from ..extensions import db

class ProductFlavor(db.Model):
    __tablename__ = 'product_flavors'

    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    flavor_name = db.Column(db.String(255), nullable=False)
    price = db.Column(db.Numeric(10,2), nullable=True)
    stock = db.Column(db.Integer, default=0)
    image_url = db.Column(db.String(255), nullable=True)

    def __repr__(self):
        return f'<Flavor {self.flavor_name} of Product {self.product_id}>'