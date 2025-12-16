from flask import Flask
from flask_cors import CORS
from flask import jsonify
from .config import Config
from .extensions import db, migrate, jwt, limiter, mail
from .routes import gift_bp


def create_app():
    app = Flask(__name__, static_folder='../static')
    CORS(app)
    app.config.from_object(Config)
    limiter.init_app(app)


    @limiter.request_filter
    def ip_whitelist():
        return False

    @app.errorhandler(429)
    def ratelimit_handler(e):
        return jsonify({
            "error": "Bạn đã thử quá nhiều lần. Vui lòng thử lại sau 5 phút."
        }), 429

    # Khởi tạo extensions trước
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    mail.init_app(app)

    # Import models SAU KHI init_app
    from .models import user, product, category, order, cart, order_item, brand, product_flavor, hash_tag, gift

    # Import routes SAU KHI models được load
    from .routes import user_bp, brand_bp, category_bp, product_bp, hash_tag_bp, product_flavor_bp, cart_bp, order_bp
    app.register_blueprint(user_bp, url_prefix='/users')
    app.register_blueprint(brand_bp, url_prefix='/brands')
    app.register_blueprint(category_bp, url_prefix='/categories')
    app.register_blueprint(product_bp, url_prefix='/products')
    app.register_blueprint(hash_tag_bp, url_prefix='/hash_tags')
    app.register_blueprint(product_flavor_bp, url_prefix='/product_flavors')
    app.register_blueprint(gift_bp, url_prefix='/gifts')
    app.register_blueprint(cart_bp, url_prefix='/cart')
    app.register_blueprint(order_bp, url_prefix='/orders')

    return app
