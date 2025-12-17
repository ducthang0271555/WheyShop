import React from 'react';
import { Bell } from "lucide-react";
import { getStatusText, getStatusClass } from "../../../utils/orderHelper";

const OrderTimeline = ({ groupedOrders, onRowClick, formatVND }) => {

    const renderPaymentBadge = (order) => {
        let label = order.payment_method;
        let statusClass = order.payment_method;

        if (order.payment_method === 'BANK') {
            if (order.is_paid) {
                label = 'BANK (Đã TT)';
                statusClass = 'BANK-PAID';
            } else {
                label = 'BANK (Chưa TT)';
                statusClass = 'BANK-PENDING';
            }
        }

        if (order.payment_method === 'COD') {
            if (order.status === 'DELIVERED' || order.is_paid) {
                label = 'COD (Đã TT)';
            }
        }

        return (
            <span className={`payment-badge ${statusClass}`}>
                {label}
            </span>
        );
    };

    return (
        <div className="orders-timeline">
            {Object.keys(groupedOrders).length === 0 ? <p>Chưa có đơn hàng nào.</p> : (
                Object.entries(groupedOrders).map(([dateLabel, orders]) => (
                    <div key={dateLabel} className="timeline-group">
                        <h3 className={`date-header ${dateLabel === "Hôm nay" ? "today" : ""}`}>
                            {dateLabel} <span>({orders.length} đơn)</span>
                        </h3>

                        <div className="order-table-wrapper">
                            <table className="admin-order-table">
                                <thead>
                                    <tr>
                                        <th>Mã đơn</th>
                                        <th>Khách hàng</th>
                                        <th>Sản phẩm</th>
                                        <th>Tổng tiền</th>
                                        <th>Thanh toán</th>
                                        <th>Trạng thái</th>
                                        <th>Thời gian</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map(order => (
                                        <tr key={order.id} onClick={() => onRowClick(order.id)}>
                                            <td><b>#{order.order_code}</b></td>
                                            <td>
                                                <div>{order.full_name}</div>
                                                <small>{order.phone}</small>
                                            </td>
                                            <td>
                                                <div className="items-summary">
                                                    {order.items_summary[0]?.product_name}
                                                    {order.items_summary.length > 1 &&
                                                        <span className="more-items"> +{order.items_summary.length - 1} món</span>
                                                    }
                                                </div>
                                            </td>
                                            <td className="col-total-amount">
                                                {formatVND(order.total_amount)}
                                            </td>
                                            <td>
                                                {renderPaymentBadge(order)}
                                            </td>
                                            <td>
                                                <div className="status-cell">
                                                    <span className={`status-badge ${getStatusClass(order.status)}`}>
                                                        {getStatusText(order.status)}
                                                    </span>

                                                    {['PENDING', 'PENDING_PAYMENT', 'PAID'].includes(order.status) && (
                                                        <Bell size={16} className="bell-icon ringing"/>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                {new Date(order.created_at).toLocaleTimeString('vi-VN', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default OrderTimeline;