import os
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_mail import Mail
from payos import PayOS

db = SQLAlchemy()
mail = Mail()
migrate = Migrate()
jwt = JWTManager()
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=[]
)
payos = PayOS(
    client_id=os.environ.get('PAYOS_CLIENT_ID'),
    api_key=os.environ.get('PAYOS_API_KEY'),
    checksum_key=os.environ.get('PAYOS_CHECKSUM_KEY')
)
