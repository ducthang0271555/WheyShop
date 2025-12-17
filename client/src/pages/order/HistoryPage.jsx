import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import orderApi from "../../api/orderApi";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import LoadingSpinner from "../../loading-spinner/LoadingSpinner";
import { getPaymentText, getStatusText, getStatusClass } from "../../utils/orderHelper";
import "../../styles/order/HistoryPage.css";
import { toast } from "react-toastify";
import ConfirmModal from "../../components/modals/ConfirmModal";

const HistoryPage = () => {
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL;
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedOrderCode, setSelectedOrderCode] = useState(null);

    const formatVND = (value) => value?.toLocaleString("vi-VN", { style: "currency", currency: "VND" });


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

    useEffect(() => {
        fetchHistory();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate]);

    const handleRequestCancel = (orderCode) => {
        setSelectedOrderCode(orderCode);
        setShowCancelModal(true);
    };

    const handleConfirmCancel = async () => {
        if (!selectedOrderCode) return;

        try {
            setLoading(true);
            await orderApi.cancel(selectedOrderCode);

            toast.success("Hủy đơn hàng thành công!");

            await fetchHistory();
        } catch (error) {
            console.error(error);
            const message = error.response?.data?.error || "Có lỗi xảy ra khi hủy đơn hàng";
            toast.error(message);
            setLoading(false);
        } finally {
            setShowCancelModal(false);
            setSelectedOrderCode(null);
        }
    };

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

                                {order.status === 'PENDING' && (
                                    <button className={"cancel-button"}
                                        onClick={() => handleRequestCancel(order.order_code)}
                                        onMouseOver={(e) => e.target.style.backgroundColor = '#b71c1c'}
                                        onMouseOut={(e) => e.target.style.backgroundColor = '#d32f2f'}
                                    >
                                        Hủy đơn hàng
                                    </button>
                                )}

                                <div className="order-total">
                                    Thành tiền:
                                    <span className="total-money">{formatVND(order.total_amount)}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}

                {showCancelModal && (
                    <ConfirmModal
                        title="Xác nhận hủy đơn hàng"
                        message={`Bạn có chắc chắn muốn hủy đơn hàng không?`}
                        onConfirm={handleConfirmCancel}
                        onCancel={() => {
                            setShowCancelModal(false);
                            setSelectedOrderCode(null);
                        }}
                    />
                )}
            </div>
            <Footer />
        </>
    );
};

export default HistoryPage;