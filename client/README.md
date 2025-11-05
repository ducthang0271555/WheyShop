```bash
client/
│
├── public/
│   └── index.html
│
├── src/
│   │   main.jsx
│   │   App.jsx
│   │
│   ├── api/
│   │   ├── axiosClient.js
│   │   ├── productApi.js
│   │   ├── categoryApi.js
│   │   ├── userApi.js
│   │   └── orderApi.js
│   │
│   ├── assets/
│   │   ├── images/
│   │   └── styles/
│   │
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProductCard.jsx
│   │   ├── Sidebar.jsx              ← dùng cho trang admin
│   │   ├── AdminHeader.jsx
│   │   └── Loader.jsx
│   │
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── CartContext.jsx
│   │   └── AdminContext.jsx         ← quản lý trạng thái admin đăng nhập
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useCart.js
│   │   └── useAdmin.js
│   │
│   ├── layouts/
│   │   ├── MainLayout.jsx           ← giao diện người dùng
│   │   ├── AdminLayout.jsx          ← giao diện quản trị (sidebar + header)
│   │   └── AuthLayout.jsx
│   │
│   ├── pages/
│   │   ├── Home/
│   │   │   └── Home.jsx
│   │   ├── Products/
│   │   │   ├── ProductList.jsx
│   │   │   └── ProductDetail.jsx
│   │   ├── Cart/
│   │   │   └── Cart.jsx
│   │   ├── Auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── Checkout/
│   │   │   └── Checkout.jsx
│   │   ├── About/
│   │   │   └── About.jsx
│   │   │
│   │   └── Admin/                   ← 🧠 khu vực quản trị
│   │       ├── Dashboard.jsx
│   │       ├── Products/
│   │       │   ├── ManageProducts.jsx
│   │       │   └── EditProduct.jsx
│   │       ├── Categories/
│   │       │   └── ManageCategories.jsx
│   │       ├── Orders/
│   │       │   └── ManageOrders.jsx
│   │       └── Users/
│   │           └── ManageUsers.jsx
│   │
│   ├── routes/
│   │   └── index.jsx
│   │
│   └── utils/
│       ├── formatCurrency.js
│       ├── constants.js
│       └── storage.js
│
├── .env
├── package.json
└── vite.config.js
```