import React, { forwardRef } from 'react';
import "../../../styles/admin/InvoiceTemplate.css";

const InvoiceTemplate = forwardRef(({ order }, ref) => {

    if (!order) return null;

    const formatVND = (value) => value?.toLocaleString("vi-VN", {style: "currency", currency: "VND"});

    return (
        <div className="invoice-paper" ref={ref}>
            <div className="invoice-header">
                <h1>HÓA ĐƠN BÁN HÀNG</h1>
                <p>Mã đơn hàng: <strong>#{order.order_code}</strong></p>
                <p>Ngày tạo: {new Date(order.created_at).toLocaleDateString('vi-VN')}</p>
            </div>

            <div className="invoice-info">
                <div style={{flex: 1}}>
                    <h3>Thông tin khách hàng</h3>
                    <p><strong>Họ tên:</strong> {order.full_name}</p>
                    <p><strong>Số điện thoại:</strong> {order.phone}</p>
                    <p><strong>Địa chỉ:</strong> {order.address}</p>
                </div>
                 <div style={{flex: 1, textAlign: 'right'}}>
                    <h3>Đơn vị bán hàng</h3>
                    <p><strong>Cửa hàng Whey Vip Pro</strong></p>
                    <p>Hotline: 0999.888.777</p>
                    <p>Địa chỉ: TP. Hồ Chí Minh</p>
                </div>
            </div>

            <table className="invoice-table">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên sản phẩm</th>
                        <th>Đơn giá</th>
                        <th>SL</th>
                        <th>Thành tiền</th>
                    </tr>
                </thead>
                <tbody>
                    {order.items.map((item, index) => (
                        <tr key={index}>
                            <td style={{textAlign: 'center'}}>{index + 1}</td>
                            <td>{item.product_name}</td>
                            <td style={{textAlign: 'right'}}>{formatVND(item.price)}</td>
                            <td style={{textAlign: 'center'}}>{item.quantity}</td>
                            <td style={{textAlign: 'right'}}>{formatVND(item.price * item.quantity)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

             <div className="invoice-total">
                <h3 style={{color: '#d32f2f'}}>TỔNG CỘNG: {formatVND(order.total_amount)}</h3>
            </div>
        </div>
    );
});

export default InvoiceTemplate;