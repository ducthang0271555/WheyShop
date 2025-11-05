import {Outlet, useNavigation} from "react-router-dom";
import AdminHeader from "../components/AdminHeader";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

export default function AdminLayout() {
    const navigation = useNavigation();
    const isLoading = navigation.state === "loading";

    return (
        <div className="admin-layout">
            <AdminHeader/>
            <div className="admin-main">
                {isLoading ? <LoadingSpinner/> : <Outlet/>}
            </div>
        </div>
    );
}
