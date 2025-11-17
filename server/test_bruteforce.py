import requests
from concurrent.futures import ThreadPoolExecutor
import time
import random

URL = "http://localhost:5000/users/login"
USERNAME = "admin"

# Danh sách mật khẩu giả để test
password_pool = [
    "123dhfgh456", "admdghdfhin", "passdghdghword", "roodghdfhgt", "1111dfghdfgh11", "abc12dgfhdfgh3", "654ddfgh321",
    "padfghdfghss123", "qwedghdghrty", "letmedfghdfghin"
]

def send_request():
    pwd = random.choice(password_pool)

    payload = {
        "username": USERNAME,
        "password": pwd
    }

    try:
        res = requests.post(URL, json=payload, timeout=2)
        print(f"[{res.status_code}] {res.text}")
    except Exception as e:
        print("Error:", e)


def run_attack(rate_per_sec=100, duration_sec=3):
    requests_per_batch = rate_per_sec
    total_requests = rate_per_sec * duration_sec

    print(f"\n🚀 Starting test: {rate_per_sec} req/sec for {duration_sec} seconds")
    print(f"📌 Total requests: {total_requests}\n")

    with ThreadPoolExecutor(max_workers=rate_per_sec) as executor:
        for _ in range(duration_sec):
            futures = [executor.submit(send_request) for _ in range(requests_per_batch)]
            time.sleep(1)  # giữ đúng 1 giây mỗi batch


if __name__ == "__main__":
    # chạy 3 giây (100 * 3 = 300 requests)
    run_attack(rate_per_sec=20, duration_sec=1)
