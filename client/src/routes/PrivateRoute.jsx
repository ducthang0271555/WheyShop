import React, {useEffect, useState} from 'react';
import {Navigate} from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

/**
 * PrivateRoute
 * @param {ReactNode} children - component cần bảo vệ
 * @param {number|null} requiredRole - role yêu cầu để truy cập (1 = admin, 0 = user), null = tất cả
 */
const PrivateRoute = ({children, requiredRole = null}) => {
    const [isAuthorized, setIsAuthorized] = useState(null);
    const [loadingMessage, setLoadingMessage] = useState("Đang xác thực...");
    const access_token = localStorage.getItem('access_token');

    useEffect(() => {
        if (!access_token) {
            setIsAuthorized(false);
            return;
        }

        setLoadingMessage("Đang xác thực token...");
        axios.get(`${process.env.REACT_APP_API_URL}/users/dashboard`, {
            headers: {Authorization: `Bearer ${access_token}`},
        })
            .then(res => {
                const currentUser = res.data.user;
                if (requiredRole !== null && currentUser.role !== requiredRole) {
                    // role không đủ
                    setIsAuthorized(false);
                    alert("Bạn không có quyền truy cập trang này!");
                    return;
                }
                setIsAuthorized(true);
            })
            .catch(err => {
                // token hết hạn hoặc không hợp lệ
                if (err.response && err.response.status === 401) {
                    alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
                }
                localStorage.removeItem('access_token');
                setIsAuthorized(false);
            });
    }, [access_token, requiredRole]);

    if (isAuthorized === null) {
        return (
            <div style={{display: "flex", justifyContent: "center", marginTop: "50px"}}>
                <LoadingSpinner message={loadingMessage}/>
            </div>
        );
    }

    if (!isAuthorized) {
        return <Navigate to="/auth/login" replace/>;
    }

    return children;
};

export default PrivateRoute;
