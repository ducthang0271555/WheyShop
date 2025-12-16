import random
import string

def generate_unique_order_code(length=8):
    # Tạo mã đơn hàng ngẫu nhiên (VD: A7X92B1Z)
    chars = string.ascii_uppercase + string.digits
    return ''.join(random.choice(chars) for _ in range(length))