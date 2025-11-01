# 🧠 WheyShop - Flask Backend

Dự án **WheyShop** với backend được xây dựng bằng **Flask** cho ứng dụng web bán hàng Whey Protein.

---

## ⚙️ Yêu cầu hệ thống
- Python 3.9.13 
- pip (trình quản lý gói Python)  
- Virtual environment (khuyên dùng)

---

## 🚀 Hướng dẫn chạy dự án trên Windows

### 1️⃣ Clone repository từ GitHub
```bash
git clone https://github.com/ducthang0271555/WheyShop.git
cd WheyShop
```
### 2️⃣ Tạo và kích hoạt môi trường ảo (virtual environment)
```bash
cd server
python -m venv venv
venv\Scripts\activate
```
### 3️⃣ Cài đặt các thư viện cần thiết
```bash
pip install -r requirements.txt
```
### 4️⃣ Cấu hình biến môi trường
Tạo file `.env` trong thư mục `server` với nội dung sau:
```env
Liên hệ ducthang0271555@gmail.com để lấy thông tin cấu hình chi tiết.
```
### 5️⃣ Chạy lệnh migrate database (dùng Flask-Migrate)
```bash
flask db upgrade
```
### 6️⃣ Chạy ứng dụng
Chạy file app.py hoặc sử dụng lệnh:
```bash
flask run
```

## 🧩 Tác giả
### Hà Trần Đức Thắng   
📧 Email: ducthang0271555@gmail.com

