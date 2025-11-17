from functools import wraps
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask import jsonify
import json

def admin_required(fn):
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        identity_str = get_jwt_identity()
        current_user = json.loads(identity_str)
        if current_user.get("role") != 1:
            return jsonify({"error": "Admin privilege required"}), 403
        return fn(*args, **kwargs)
    return wrapper
