import React from 'react';

const CheckoutForm = ({ customerInfo, onInputChange, onCheckout }) => {
    return (
        <div className="customer-section">
            <div className="section-title">Thông tin khách hàng</div>

            <div className="form-row">
                <input
                    type="text"
                    name="name"
                    className="form-input"
                    placeholder="Họ và tên (bắt buộc)"
                    value={customerInfo.name}
                    onChange={onInputChange}
                />
                <input
                    type="text"
                    name="phone"
                    className="form-input"
                    placeholder="Số điện thoại (bắt buộc)"
                    value={customerInfo.phone}
                    onChange={onInputChange}
                />
            </div>

            <div className="form-row">
                <input
                    type="email"
                    name="email"
                    className="form-input"
                    placeholder="Email (Dùng để thông báo đơn hàng)..."
                    value={customerInfo.email}
                    onChange={onInputChange}
                />
            </div>
            <p className="warning-text">
                Nếu bạn không có Email, vui lòng nhắn tin Messenger hoặc Chat Zalo để đặt hàng
            </p>

            <div className="section-title">Chọn địa chỉ nhận hàng</div>

            <div className="form-row">
                <select className="form-select" name="city" onChange={onInputChange} value={customerInfo.city}>
                    <option value="">Tỉnh/Thành</option>
                    <option value="Hanoi">Hà Nội</option>
                    <option value="HCM">Hồ Chí Minh</option>
                </select>
                <select className="form-select" name="district" onChange={onInputChange} value={customerInfo.district}>
                    <option value="">Quận/Huyện</option>
                </select>
                <select className="form-select" name="ward" onChange={onInputChange} value={customerInfo.ward}>
                    <option value="">Phường/Xã</option>
                </select>
            </div>

            <div className="form-row">
                <input
                    type="text"
                    name="address"
                    className="form-input"
                    placeholder="Số nhà, tên đường..."
                    value={customerInfo.address}
                    onChange={onInputChange}
                />
            </div>

            <div className="form-row">
                <textarea
                    name="note"
                    className="form-textarea"
                    placeholder="Ghi chú thêm (nếu có)..."
                    value={customerInfo.note}
                    onChange={onInputChange}
                ></textarea>
            </div>

            <button className="checkout-btn" onClick={onCheckout}>
                Xác nhận đặt hàng
            </button>
        </div>
    );
};

export default CheckoutForm;