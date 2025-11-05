import '../styles/components/navbar.css';
import {Search, ShoppingCart, User, Phone, Menu} from "lucide-react";
import {useNavigate} from "react-router-dom";

export default function NavBar() {
    const navigate = useNavigate();

    return (
        <div className="navbar">
            <div className="container">
                {/* Logo + Danh mục */}
                <div className="logo-and-categories">
                    <img
                        src="/logo.png"
                        alt="WheyShop"
                    />
                    <button>
                        <Menu size={20}/>
                        <span>Danh mục</span>
                    </button>
                </div>

                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Nhập tên sản phẩm để tìm kiếm..."
                    />
                    <button>
                        <Search size={20}/>
                    </button>
                </div>


                <div className="contact">
                    <Phone size={20}/>
                    <div>
                        <div>Gọi mua hàng</div>
                        <div>0981 33 58 58</div>
                    </div>
                </div>

                <button className="cart">
                    <ShoppingCart size={22}/>
                    <span>Giỏ hàng</span>
                </button>

                <button className="login" onClick={() => navigate('/auth/login')}>
                    <User size={22}/>
                    <span>Đăng nhập</span>
                </button>


            </div>
        </div>
    );
}
