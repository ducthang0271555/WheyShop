import { useEffect, useState } from "react";
import orderApi from "../../api/orderApi";
import LoadingSpinner from "../../loading-spinner/LoadingSpinner";
import { getStatusText, getStatusClass } from "../../utils/orderHelper";
import { Bell } from "lucide-react";
import "../../styles/admin/Dashboard.css";
import { toast } from "react-toastify";

function Dashboard() {
    const [groupedOrders, setGroupedOrders] = useState({});
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0 });

    const [selectedOrder, setSelectedOrder] = useState(null);

    const formatVND = (value) => value?.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await orderApi.getAllOrders();
            const orders = res.orders || [];

            const revenue = orders.reduce((sum, order) => {
              const isValidStatus = ['PAID', 'DELIVERED'].includes(order.status);
              const isPaid = order.is_paid === true;

              return sum + (isValidStatus || isPaid ? order.total_amount : 0);
            }, 0);
            setStats({ totalOrders: orders.length, totalRevenue: revenue });

            const groups = {};
            const today = new Date().toLocaleDateString('vi-VN');

            orders.forEach(order => {
                const dateObj = new Date(order.created_at);
                const dateStr = dateObj.toLocaleDateString('vi-VN');
                const key = dateStr === today ? "Hôm nay" : dateStr;

                if (!groups[key]) groups[key] = [];
                groups[key].push(order);
            });
            setGroupedOrders(groups);
        } catch (error) {
            console.error("Lỗi:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleUpdateStatus = async (orderId, newStatus) => {
        if(!window.confirm(`Bạn muốn chuyển trạng thái đơn hàng sang: ${newStatus}?`)) return;

        try {
            await orderApi.updateStatus(orderId, newStatus);
            toast.success("Cập nhật trạng thái thành công!");
            setSelectedOrder(null);
            fetchOrders();
        } catch (error) {
            toast.error("Lỗi cập nhật trạng thái");
        }
    }

    if (loading) return <div style={{ marginTop: 50, textAlign: 'center' }}><LoadingSpinner /></div>;

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Tổng quan đơn hàng</h1>

            <div className="stats-cards">
                <div className="stat-card">
                    <h3>Tổng đơn hàng</h3>
                    <p>{stats.totalOrders}</p>
                </div>
                <div className="stat-card" style={{ borderColor: '#2e7d32' }}>
                    <h3>Doanh thu</h3>
                    <p style={{ color: '#2e7d32' }}>{formatVND(stats.totalRevenue)}</p>
                </div>
            </div>

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
                                            <tr key={order.id} onClick={() => setSelectedOrder(order)}>
                                                <td><b>#{order.order_code}</b></td>
                                                <td>
                                                    <div>{order.full_name}</div>
                                                    <small>{order.phone}</small>
                                                </td>
                                                <td>
                                                    <div className="items-summary">
                                                        {order.items_summary[0]?.product_name}
                                                        {order.items_summary.length > 1 &&
                                                            <span
                                                                className="more-items"> +{order.items_summary.length - 1} món</span>
                                                        }
                                                    </div>
                                                </td>
                                                <td style={{fontWeight: 'bold', color: '#d32f2f'}}>
                                                    {formatVND(order.total_amount)}
                                                </td>
                                                <td>
                                                    {(() => {
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
                                                    })()}
                                                </td>
                                                <td>
                                                    <div style={{display: 'flex', alignItems: 'center', gap: 5}}>
                                                        <span
                                                            className={`status-badge ${getStatusClass(order.status)}`}>
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

            {selectedOrder && (
                <div className="order-modal-overlay" onClick={() => setSelectedOrder(null)}>
                    <div className="order-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="order-modal-header">
                            <h2>Chi tiết đơn hàng #{selectedOrder.order_code}</h2>
                            <button className="close-modal-btn" onClick={() => setSelectedOrder(null)}>×</button>
                        </div>

                        <div className="modal-section">
                            <h4>Thông tin khách hàng</h4>
                            <p><strong>Tên:</strong> {selectedOrder.full_name}</p>
                            <p><strong>SĐT:</strong> {selectedOrder.phone}</p>
                            <p><strong>Địa chỉ:</strong> {selectedOrder.address}</p>
                        </div>

                        <div className="modal-section">
                            <h4>Sản phẩm ({selectedOrder.items_summary.length})</h4>
                            <ul>
                                {selectedOrder.items_summary.map((item, idx) => (
                                    <li key={idx} style={{marginBottom: 5}}>
                                        {item.product_name}
                                        <span style={{color:'#666'}}> (x{item.quantity})</span>
                                    </li>
                                ))}
                            </ul>
                            <p style={{marginTop: 10, fontWeight: 'bold', fontSize: 16}}>
                                Tổng tiền: <span style={{color: '#d32f2f'}}>{formatVND(selectedOrder.total_amount)}</span>
                            </p>
                        </div>

                        {/* NÚT CẬP NHẬT TRẠNG THÁI */}
                        <div className="status-actions">
                            {selectedOrder.status !== 'CANCELLED' && selectedOrder.status !== 'DELIVERED' && (
                                <>
                                    <button
                                        className="action-btn btn-shipping"
                                        onClick={() => handleUpdateStatus(selectedOrder.id, 'SHIPPING')}
                                    >
                                        Đang giao hàng
                                    </button>

                                    <button
                                        className="action-btn btn-delivered"
                                        onClick={() => handleUpdateStatus(selectedOrder.id, 'DELIVERED')}
                                    >
                                        Đã giao thành công
                                    </button>

                                    <button
                                        className="action-btn btn-cancel"
                                        onClick={() => handleUpdateStatus(selectedOrder.id, 'CANCELLED')}
                                    >
                                        Hủy đơn
                                    </button>
                                </>
                            )}
                            {selectedOrder.status === 'DELIVERED' && <p style={{color: 'green', fontWeight:'bold', width: '100%', textAlign: 'center'}}>Đơn hàng đã hoàn thành</p>}
                            {selectedOrder.status === 'CANCELLED' && <p style={{color: 'red', fontWeight:'bold', width: '100%', textAlign: 'center'}}>Đơn hàng đã hủy</p>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;