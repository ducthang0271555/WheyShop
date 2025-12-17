import '../../styles/components/header/navbar.css';
import {ShoppingCart, User, Phone, FileText} from "lucide-react";
import {useNavigate, useLocation} from "react-router-dom";
import {useState, useEffect, useRef} from "react";
import ConfirmModal from "../modals/ConfirmModal";
import SearchBar from "./SearchBar";
import {getCartLocal} from "../../utils/cart";
import cartApi from "../../api/cartApi";


export default function NavBar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [loggedIn, setLoggedIn] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);
    const menuRef = useRef(null);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        setLoggedIn(!!token);
        updateCartBadge(!!token);
    }, [location.pathname]);


    useEffect(() => {
            const handleCartChange = () => {
                const token = localStorage.getItem("access_token");
                updateCartBadge(!!token);
            };

            window.addEventListener("storage", handleCartChange);
            window.addEventListener("cart-change", handleCartChange);

            return () => {
                window.removeEventListener("storage", handleCartChange);
                window.removeEventListener("cart-change", handleCartChange);
            };
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
        setCartCount(0);
        navigate("/");
        updateCartBadge(false);
    }

    const updateCartBadge = async (isUserLoggedIn) => {
        if (isUserLoggedIn) {
            try {
                const res = await cartApi.getCart();
                const items = res.cart_items || [];
                const total = items.reduce((sum, item) => sum + item.quantity, 0);
                setCartCount(total);
            } catch (error) {
                console.error("Lỗi lấy số lượng giỏ hàng:", error);
            }
        } else {
            const cart = getCartLocal();
            const total = cart.reduce((sum, item) => sum + item.quantity, 0);
            setCartCount(total);
        }
    };

    const handleOrderClick = () => {
        if (loggedIn) {
            navigate('/history');
        } else {
            navigate('/order-lookup');
        }
    };


    return (
        <div className="navbar">
            <div className="container">
                <div className="logo-and-categories">
                    <img
                        src="/logo.png"
                        alt="WheyShop"
                        onClick={() => navigate('/')}
                    />
                    {/*<button>*/}
                    {/*    <Menu size={20}/>*/}
                    {/*    <span>Danh mục</span>*/}
                    {/*</button>*/}
                </div>

                <div className="search-bar">
                    <SearchBar/>
                </div>


                <div className="contact">
                    <Phone size={20}/>
                    <div>
                        <div>Gọi mua hàng</div>
                        <div>0981 33 58 58</div>
                    </div>
                </div>

                <button className="cart" onClick={() => navigate('/cart')}>
                    <ShoppingCart size={22}/>
                    <span>Giỏ hàng</span>

                    {cartCount > 0 && (
                        <span className="cart-badge">{cartCount}</span>
                    )}
                </button>

                <button className="cart" onClick={handleOrderClick} style={{marginRight: '10px'}}>
                    <FileText size={22}/>
                    <span>Đơn hàng</span>
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
