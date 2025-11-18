import secrets
import hashlib
from datetime import datetime, timedelta
from flask import current_app
from app.extensions import mail
from flask_mail import Message

def generate_otp_code(length=6):
    # generate secure numeric OTP with leading zeros allowed
    digits = '0123456789'
    return ''.join(secrets.choice(digits) for _ in range(length))

def hash_otp(otp):
    return hashlib.sha256(otp.encode()).hexdigest()

def send_otp_email(to_email, otp, expires_minutes=5):
    subject = "Mã OTP khôi phục mật khẩu"
    body = (
        f"Bạn (hoặc ai đó) đã yêu cầu đặt lại mật khẩu.\n\n"
        f"Mã OTP: {otp}\n"
        f"Mã có hiệu lực trong {expires_minutes} phút.\n\n"
        "Nếu bạn không yêu cầu, hãy bỏ qua email này."
    )

    msg = Message(subject=subject, recipients=[to_email], body=body, sender=current_app.config.get('MAIL_DEFAULT_SENDER'))
    mail.send(msg)
