from flask import Flask
from flask_cors import CORS
from .config import Config
from .extensions import db, migrate, jwt

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config.from_object(Config)

    # Khởi tạo extensions trước
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # Import models SAU KHI init_app
    from .models import user, product, category, order, cart, order_item, brand, product_flavor

    # Import routes SAU KHI models được load
    from .routes import user_bp, brand_bp, category_bp, product_bp
    app.register_blueprint(user_bp, url_prefix='/users')
    app.register_blueprint(brand_bp, url_prefix='/brands')
    app.register_blueprint(category_bp, url_prefix='/categories')
    app.register_blueprint(product_bp, url_prefix='/products')

    return app
