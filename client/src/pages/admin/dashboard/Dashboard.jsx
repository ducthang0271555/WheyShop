import {useEffect, useRef, useState} from "react";
import orderApi from "../../../api/orderApi";
import LoadingSpinner from "../../../loading-spinner/LoadingSpinner";
import {Download, X} from "lucide-react";
import "../../../styles/admin/Dashboard.css";
import InvoiceTemplate from "./InvoiceTemplate";
import OrderTimeline from "./OrderTimeline";
import OrderDetailModal from "./OrderDetailModal";
import { toast } from "react-toastify";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function Dashboard() {
    const [groupedOrders, setGroupedOrders] = useState({});
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0 });

    const [showInvoice, setShowInvoice] = useState(false);
    const invoiceRef = useRef(null);

    const apiUrl = process.env.REACT_APP_API_URL;

    const [selectedOrder, setSelectedOrder] = useState(null);

    const formatVND = (value) => value?.toLocaleString("vi-VN", {style: "currency", currency: "VND"});

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
            setStats({totalOrders: orders.length, totalRevenue: revenue});

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



    const handleDownloadPDF = async () => {
        const element = invoiceRef.current;
        if (!element) return;
        try {
            toast.info("Đang tạo PDF...");
            const canvas = await html2canvas(element, {scale: 2, useCORS: true});
            const imgData = canvas.toDataURL('image/png');

            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth(); // 210
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Hoa_don_${selectedOrder.order_code}.pdf`);
            toast.success("Tải xong!");
        } catch (err) {
            console.error(err);
            toast.error("Lỗi tạo PDF");
        }
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        if (!window.confirm(`Bạn muốn chuyển trạng thái đơn hàng sang: ${newStatus}?`)) return;

        try {
            await orderApi.updateStatus(orderId, newStatus);
            toast.success("Cập nhật trạng thái thành công!");
            setSelectedOrder(null);
            fetchOrders();
        } catch (error) {
            toast.error("Lỗi cập nhật trạng thái");
        }
    }

    const handleRowClick = async (orderId) => {
        setLoading(true);
        setSelectedOrder({id: orderId, loading: true});

        try {
            const res = await orderApi.getOrderDetail(orderId);
            setSelectedOrder(res.order);
        } catch (error) {
            console.error("Lỗi tải chi tiết:", error);
            toast.error("Không thể tải chi tiết đơn hàng");
            setSelectedOrder(null);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading-wrapper"><LoadingSpinner/></div>;

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Tổng quan đơn hàng</h1>

            <div className="stats-cards">
                <div className="stat-card">
                    <h3>Tổng đơn hàng</h3>
                    <p>{stats.totalOrders}</p>
                </div>
                <div className="stat-card revenue">
                    <h3>Doanh thu</h3>
                    <p>{formatVND(stats.totalRevenue)}</p>
                </div>
            </div>

            <OrderTimeline
                groupedOrders={groupedOrders}
                onRowClick={handleRowClick}
                formatVND={formatVND}
            />

            <OrderDetailModal
                visible={!!selectedOrder}
                order={selectedOrder}
                loading={loading}
                onClose={() => setSelectedOrder(null)}
                apiUrl={apiUrl}
                formatVND={formatVND}
                onUpdateStatus={handleUpdateStatus}
                onShowInvoice={() => setShowInvoice(true)}
            />

            {showInvoice && selectedOrder && (
                <div className="invoice-modal-overlay" onClick={() => setShowInvoice(false)}>
                    <div className="invoice-container" onClick={e => e.stopPropagation()}>
                        <div className="invoice-actions">
                            <button className="action-btn btn-download" onClick={handleDownloadPDF}><Download
                                size={20}/> PDF
                            </button>
                            <button className="action-btn btn-close-invoice" onClick={() => setShowInvoice(false)}><X
                                size={20}/></button>
                        </div>

                        <InvoiceTemplate order={selectedOrder} ref={invoiceRef}/>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;