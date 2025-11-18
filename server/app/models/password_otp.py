from datetime import datetime
from ..extensions import db

class PasswordOTP(db.Model):
    __tablename__ = "password_otp"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    otp_hash = db.Column(db.String(128), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    expires_at = db.Column(db.DateTime, nullable=False)
    resend_available_at = db.Column(db.DateTime, nullable=False)
    used = db.Column(db.Boolean, default=False, nullable=False)
    attempts = db.Column(db.Integer, default=0, nullable=False)
    resend_count = db.Column(db.Integer, default=0, nullable=False)
