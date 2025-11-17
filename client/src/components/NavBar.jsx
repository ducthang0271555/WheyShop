import '../styles/components/navbar.css';
import {Search, ShoppingCart, User, Phone, Menu} from "lucide-react";
import {useNavigate} from "react-router-dom";
import {useState, useEffect, useRef} from "react";
import ConfirmModal from "./modals/ConfirmModal";


export default function NavBar() {
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);
    const menuRef = useRef(null);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        setLoggedIn(!!token);
    }, []);

    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpenMenu(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleConfirmLogout = () => {
        localStorage.removeItem("access_token");
        setLoggedIn(false);
        setShowLogoutModal(false);
        navigate("/");
    }


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

                <div className="user-menu-wrapper" ref={menuRef}>
                    {!loggedIn ? (
                        <button className="login" onClick={() => navigate('/auth/login')}>
                            <User size={22}/>
                            <span>Đăng nhập</span>
                        </button>
                    ) : (
                        <>
                            <button
                                className="login"
                                onClick={() => setOpenMenu(!openMenu)}
                            >
                                <User size={22}/>
                            </button>

                            {openMenu && (
                                <div className="dropdown-menu">
                                    <div className="menu-item" onClick={() => navigate('/auth/change-password')}>
                                        Đổi mật khẩu
                                    </div>
                                    <div
                                        className="menu-item logout"
                                        onClick={() => setShowLogoutModal(true)}
                                    >
                                        Đăng xuất
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
            {showLogoutModal && (
                <ConfirmModal
                    title="Xác nhận đăng xuất"
                    message="Bạn có chắc chắn muốn đăng xuất chứ?"
                    onConfirm={handleConfirmLogout}
                    onCancel={() => setShowLogoutModal(false)}
                />
            )}
        </div>
    );
}
