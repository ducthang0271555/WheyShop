import '../../styles/admin/AdminHeader.css';
import {LogOut, Menu} from "lucide-react";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

function AdminHeader() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();


    const handleLogout = () => {
        localStorage.removeItem("access_token");
        navigate("/");
    }

    return (
        <div className="top-banner-admin">
            <button onClick={() => setIsSidebarOpen(true)}><Menu size={20}/></button>
            Trang ADMIN
            <button onClick={handleLogout}>
                <LogOut size={20}/>
                <span>Đăng xuất</span>
            </button>

            {isSidebarOpen && (
                <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}>
                    <div className="sidebar" onClick={(e) => e.stopPropagation()}>
                        <p><strong>Menu</strong></p>
                        <hr/>
                        <ul>
                            <li><a href="/admin/manage-user">Quản lý tài khoản</a></li>
                            <li><a href="/admin/manage-category">Quản lý loại sản phẩm</a></li>
                            <li><a href="/admin/manage-brand">Quản lý thương hiệu</a></li>
                            <li><a href="/admin/manage-hashtag">Quản lý Hashtag</a></li>
                            <li><a href="/admin/manage-product">Quản lý sản phẩm</a></li>
                            <li><a href="/admin/manage-gift">Quản lý quà tặng</a></li>

                        </ul>
                    </div>
                </div>
            )}
        </div>

    );
}

export default AdminHeader;