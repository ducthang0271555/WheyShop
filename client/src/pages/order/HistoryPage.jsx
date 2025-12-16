import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import orderApi from "../../api/orderApi";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import LoadingSpinner from "../../loading-spinner/LoadingSpinner";
import { getPaymentText, getStatusText, getStatusClass } from "../../utils/orderHelper";
import "../../styles/order/HistoryPage.css";

const HistoryPage = () => {
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL;
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const formatVND = (value) => value?.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

    useEffect(() => {
        const fetchHistory = async () => {
            const token = localStorage.getItem("access_token");
            if (!token) {
                navigate("/auth/login");
                return;
            }

            try {
                const res = await orderApi.getMyOrders();
                setOrders(res.orders || []);
            } catch (error) {
                console.error("Lỗi tải lịch sử:", error);
                if (error.response && error.response.status === 401) {
                    localStorage.removeItem("access_token");
                    navigate("/auth/login");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [navigate]);

    if (loading) return <div style={{marginTop: 100, textAlign: 'center'}}><LoadingSpinner /></div>;

    return (
        <>
            <Header />
            <div className="history-container">
                <h1 className="history-title">Lịch sử đơn hàng</h1>

                {orders.length === 0 ? (
                    <div style={{textAlign: "center", padding: 40, background: "#fff", borderRadius: 8}}>
                        <p>Bạn chưa có đơn hàng nào.</p>
                        <button
                            style={{marginTop: 15, padding: "10px 20px", background: "#d32f2f", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer"}}
                            onClick={() => navigate("/")}
                        >
                            Mua sắm ngay
                        </button>
                    </div>
                ) : (
                    orders.map((order) => (
                        <div key={order.order_code} className="order-card">
                            <div className="order-header">
                                <div>
                                    <span className="order-code-label">#{order.order_code}</span>
                                    <span className="order-date">{new Date(order.created_at).toLocaleDateString('vi-VN')}</span>
                                </div>
                                <div className={`status-badge ${getStatusClass(order.status)}`}>
                                    {getStatusText(order.status)}
                                </div>
                            </div>

                            <div className="order-items">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="history-item">
                                        <img
                                            src={item.image_url ? `${apiUrl}/${item.image_url}` : "/placeholder.png"}
                                            alt={item.product_name}
                                            className="history-img"
                                        />
                                        <div className="history-info">
                                            <div className="history-name">{item.product_name}</div>
                                            <div className="history-variant">
                                                {item.flavor_name && `Phân loại: ${item.flavor_name}`}
                                                {item.flavor_name && item.gift_name && " | "}
                                                {item.gift_name && `Quà: ${item.gift_name}`}
                                            </div>
                                            <div style={{fontSize: 13, marginTop: 4}}>x{item.quantity}</div>
                                        </div>
                                        <div className="history-price">
                                            {formatVND(item.price)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="order-footer">
                                <div style={{fontSize: 13, color: '#666'}}>
                                    {getPaymentText(order.payment_method, order.status)}
                                </div>
                                <div className="order-total">
                                    Thành tiền:
                                    <span className="total-money">{formatVND(order.total_amount)}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <Footer />
        </>
    );
};

export default HistoryPage;