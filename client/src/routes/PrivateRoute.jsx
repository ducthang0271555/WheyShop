import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import userApi from "../api/userApi";
import LoadingSpinner from "../loading-spinner/LoadingSpinner";

const PrivateRoute = ({ children, requiredRole = null }) => {
    const [isAuthorized, setIsAuthorized] = useState(null);
    const access_token = localStorage.getItem('access_token');

    useEffect(() => {
        if (!access_token) {
            setIsAuthorized(false);
            return;
        }

        const checkAuth = async () => {
            try {
                const res = await userApi.getProfile();
                const currentUser = res.user;

                if (!currentUser) {
                    throw new Error("Không tìm thấy thông tin user");
                }

                if (requiredRole !== null && Number(currentUser.role) !== requiredRole) {
                    setIsAuthorized(false);
                    return;
                }

                setIsAuthorized(true);

            } catch (err) {
                console.error("Lỗi xác thực:", err);

                if (err.response && err.response.status === 401) {
                    alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
                    localStorage.removeItem('access_token');
                }
                setIsAuthorized(false);
            }
        };

        checkAuth();
    }, [access_token, requiredRole]);

    if (isAuthorized === null) {
        return (
            <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
                <LoadingSpinner />
            </div>
        );
    }

    if (!isAuthorized) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PrivateRoute;