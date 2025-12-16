import React, { useState } from "react";
import orderApi from "../../api/orderApi";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import LoadingSpinner from "../../loading-spinner/LoadingSpinner";
import "../../styles/order/OrderLookup.css";
import { getStatusText, getStatusClass, getPaymentText } from "../../utils/orderHelper";

const OrderLookup = () => {
    const [code, setCode] = useState("");
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const apiUrl = process.env.REACT_APP_API_URL;

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!code.trim()) {
            setError("Vui lòng nhập mã đơn hàng");
            return;
        }

        setLoading(true);
        setError("");
        setOrderData(null);

        try {
            const res = await orderApi.lookupOrder(code.trim());
            setOrderData(res.order);
        } catch (err) {
            console.error(err);
            setError("Không tìm thấy đơn hàng. Vui lòng kiểm tra lại mã.");
        } finally {
            setLoading(false);
        }
    };

    const formatVND = (value) => value?.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

    return (
        <>
            <Header />
            <div className="lookup-container">
                <div className="search-box">
                    <h1 className="search-title">Tra cứu đơn hàng</h1>
                    <form className="search-input-group" onSubmit={handleSearch}>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Nhập mã đơn hàng (VD: A7X92B1Z)..."
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />
                        <button type="submit" className="search-btn">Tìm kiếm</button>
                    </form>
                    {error && <p style={{color: 'red', marginTop: 10}}>{error}</p>}
                </div>

                {loading && <LoadingSpinner />}

                {orderData && (
                    <div className="order-result">
                        <div className="result-header">
                            <div>
                                <h2>Đơn hàng #{orderData.order_code}</h2>
                                <p style={{fontSize: 14, color: '#666'}}>
                                    Ngày đặt: {new Date(orderData.created_at).toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <span className={`status-badge ${getStatusClass(orderData.status)}`}>
                                    {getStatusText(orderData.status)}
                                </span>
                            </div>
                        </div>

                        <div className="customer-info" style={{marginBottom: 20}}>
                            <p><strong>Người nhận:</strong> {orderData.full_name} - {orderData.phone}</p>
                            <p><strong>Địa chỉ:</strong> {orderData.address}</p>

                            <p>
                                <strong>Thanh toán: </strong>
                                <span style={{color: '#333'}}>
                                    {getPaymentText(orderData.payment_method, orderData.status)}
                                </span>
                            </p>
                        </div>

                        <h3>Danh sách sản phẩm</h3>
                        <div className="items-list">
                            {orderData.items.map((item, index) => (
                                <div key={index} className="item-row">
                                    <img
                                        src={item.image_url ? `${apiUrl}/${item.image_url}` : "/placeholder.png"}
                                        alt={item.product_name}
                                        className="item-thumb"
                                    />
                                    <div style={{flex: 1}}>
                                        <div style={{fontWeight: 'bold'}}>{item.product_name}</div>
                                        <div style={{fontSize: 13, color: '#666'}}>
                                            {item.flavor_name && `Vị: ${item.flavor_name}`}
                                            {item.gift_name && ` | Quà: ${item.gift_name}`}
                                        </div>
                                    </div>
                                    <div style={{textAlign: 'right'}}>
                                        <div>{formatVND(item.price)}</div>
                                        <div style={{color: '#666'}}>x{item.quantity}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{textAlign: 'right', fontSize: 18, fontWeight: 'bold', marginTop: 10}}>
                            Tổng tiền: <span style={{color: '#d32f2f'}}>{formatVND(orderData.total_amount)}</span>
                        </div>
                    </div>
                )}
            </div>
            <Footer/>
        </>
    );
};

export default OrderLookup;