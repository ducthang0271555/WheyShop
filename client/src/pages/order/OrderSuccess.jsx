import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import {clearCartLocal} from "../../utils/cart";
import cartApi from "../../api/cartApi";
import "../../styles/order/OrderSuccess.css";
import { toast } from "react-toastify";
import { Copy } from "lucide-react";

const OrderSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [orderCode, setOrderCode] = useState(null);
    const [status, setStatus] = useState("success"); // success | cancel

    useEffect(() => {
        if (location.state && location.state.orderCode) {
            setOrderCode(location.state.orderCode);
        }
        else {
            const params = new URLSearchParams(location.search);
            const refCode = params.get("ref");
            const statusParam = params.get("status");
            const cancelParam = params.get("cancel");

            if (refCode) setOrderCode(refCode);

            if (cancelParam === "true" || statusParam === "CANCELLED") {
                setStatus("cancel");
            }
        }
    }, [location]);

    useEffect(() => {
        if (status === "success") {
            const token = localStorage.getItem("access_token");
            clearCartLocal();

            if (token) {
                cartApi.clearCart().catch(err => console.log("Cart already cleared"));
            }
        }
    }, [status]);

    const handleCopyCode = () => {
        if (orderCode) {
            navigator.clipboard.writeText(orderCode);
            toast.success("Đã sao chép mã đơn hàng!", {
                autoClose: 2000,
                hideProgressBar: true,
                position: "bottom-center"
            });
        }
    };

    const handleViewOrder = () => {
        const token = localStorage.getItem("access_token");

        if (token) {
            navigate("/history");
        } else {
            navigate("/order-lookup", {state: {autoSearchCode: orderCode}});
        }
    };

    return (
        <>
            <Header />
            <div className="order-success-container">
                <div className="success-card">
                    {status === "success" ? (
                        <>
                            <div className="success-icon-wrapper">
                                <svg className="success-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h1 className="success-title">Đặt hàng thành công!</h1>
                            <p className="success-message">
                                Cảm ơn bạn đã mua hàng tại Whey Vip Pro.<br />
                                Đơn hàng của bạn đã được tiếp nhận và đang xử lý.
                            </p>
                        </>
                    ) : (
                        <>
                            <div className="success-icon-wrapper" style={{backgroundColor: '#ffebee'}}>
                                <svg className="success-icon" style={{color: '#d32f2f'}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <h1 className="success-title" style={{color: '#d32f2f'}}>Thanh toán bị hủy!</h1>
                            <p className="success-message">
                                Giao dịch thanh toán đã bị hủy hoặc thất bại.<br />
                                Vui lòng thử lại hoặc chọn phương thức thanh toán khác.
                            </p>
                        </>
                    )}

                    {orderCode && (
                        <div className="order-info-box">
                            <div className="order-label">Mã đơn hàng của bạn</div>
                            <div className="order-code-wrapper"
                                 style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'}}>
                                <div className="order-code" style={{marginBottom: 0}}>{orderCode}</div>

                                <button
                                    onClick={handleCopyCode}
                                    title="Sao chép mã đơn"
                                    onMouseOver={(e) => e.currentTarget.style.color = '#007bff'}
                                    onMouseOut={(e) => e.currentTarget.style.color = '#666'}
                                >
                                    <Copy size={18}/>
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="action-buttons">
                        <button className="btn-home" onClick={() => navigate("/")}>
                            Tiếp tục mua sắm
                        </button>
                        <button className="btn-history" onClick={handleViewOrder}>
                            Xem đơn hàng
                        </button>
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    );
};

export default OrderSuccess;