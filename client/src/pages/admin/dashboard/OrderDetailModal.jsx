import React from 'react';
import LoadingSpinner from "../../../loading-spinner/LoadingSpinner";
import { FileText } from "lucide-react";

const OrderDetailModal = ({
    order,
    visible,
    loading,
    onClose,
    apiUrl,
    formatVND,
    onUpdateStatus,
    onShowInvoice
}) => {

    if (!visible || !order) return null;

    return (
        <div className="order-modal-overlay" onClick={onClose}>
            <div className="order-modal-content" onClick={e => e.stopPropagation()}>

                {loading ? (
                    <LoadingSpinner />
                ) : (
                    <>
                        <div className="order-modal-header">
                            <h2>Đơn hàng #{order.order_code}</h2>
                            <button className="close-modal-btn" onClick={onClose}>×</button>
                        </div>

                        <div className="modal-section">
                            <h4>Thông tin khách hàng</h4>
                            <div className="customer-info-grid">
                                <p><strong>Người nhận:</strong> {order.full_name}</p>
                                <p><strong>SĐT:</strong> {order.phone}</p>
                                <p className="full-width"><strong>Địa chỉ:</strong> {order.address}</p>
                                <p className="full-width text-muted">
                                    <strong>Ghi chú:</strong> {order.note || 'Không có'}
                                </p>
                            </div>
                        </div>

                        <div className="modal-section">
                            <h4>Danh sách sản phẩm</h4>
                            <div className="detail-items-list">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="item-row">
                                        <img
                                            src={item.image_url ? `${apiUrl}/${item.image_url}` : "/placeholder.png"}
                                            alt="thumb"
                                            className="item-image"
                                        />

                                        <div className="item-info">
                                            <div className="item-name">{item.product_name}</div>
                                            <div className="item-meta">
                                                {item.flavor_name && <span className="item-flavor">Hương vị: <b>{item.flavor_name}</b></span>}
                                                {item.gift_name && <span className="item-gift">🎁 {item.gift_name}</span>}
                                            </div>
                                        </div>

                                        <div className="item-price-block">
                                            <div className="item-price">{formatVND(item.price)}</div>
                                            <div className="item-qty">x{item.quantity}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="modal-footer-summary">
                                <div>
                                    Trạng thái TT:
                                    <span className={`payment-status-text ${order.is_paid ? 'paid' : 'unpaid'}`}>
                                        {order.is_paid ? 'ĐÃ THANH TOÁN' : 'CHƯA THANH TOÁN'}
                                    </span>
                                </div>
                                <div className="total-block">
                                    Tổng: <span>{formatVND(order.total_amount)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="status-actions">
                            {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                                <>
                                    <button
                                        className="action-btn btn-shipping"
                                        onClick={() => onUpdateStatus(order.id, 'SHIPPING')}
                                    >
                                        Đang giao hàng
                                    </button>

                                    <button
                                        className="action-btn btn-delivered"
                                        onClick={() => onUpdateStatus(order.id, 'DELIVERED')}
                                    >
                                        Đã giao thành công
                                    </button>

                                    <button
                                        className="action-btn btn-cancel"
                                        onClick={() => onUpdateStatus(order.id, 'CANCELLED')}
                                    >
                                        Hủy đơn
                                    </button>
                                </>
                            )}

                            <button className="action-btn" style={{
                                backgroundColor: '#607d8b',
                                display: 'flex',
                                justifyContent: 'center',
                                gap: 5
                            }} onClick={onShowInvoice}>
                                <FileText size={16} /> Hóa đơn
                            </button>

                            {order.status === 'DELIVERED' &&
                                <p className="status-message success">Đơn hàng đã hoàn thành</p>
                            }
                            {order.status === 'CANCELLED' &&
                                <p className="status-message error">Đơn hàng đã hủy</p>
                            }
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default OrderDetailModal;