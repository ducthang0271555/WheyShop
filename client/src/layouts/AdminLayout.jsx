import { Outlet } from "react-router-dom";
import AdminHeader from "../components/header/AdminHeader";

export default function AdminLayout() {
    return (
        <div className="admin-layout">
            <AdminHeader/>
            <div className="admin-main">
                <Outlet/>
            </div>
        </div>
    );
}
