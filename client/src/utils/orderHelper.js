export const getPaymentText = (paymentMethod, status) => {
    if (paymentMethod === 'COD') {
        return 'Thanh toán khi nhận hàng (COD)';
    }

    if (paymentMethod === 'BANK') {
        if (status === 'PAID' || status === 'SHIPPING' || status === 'DELIVERED') {
            return 'Đã thanh toán (Chuyển khoản)';
        }
        return 'Chờ thanh toán (Chuyển khoản)';
    }

    return paymentMethod;
};

export const getStatusText = (status) => {
    switch (status) {
        case 'PENDING':
        case 'PENDING_PAYMENT':
            return 'Đang chờ xử lý';

        case 'PAID':
            return 'Đang chờ xử lý';

        case 'SHIPPING':
            return 'Đang giao hàng';

        case 'DELIVERED':
            return 'Đã giao hàng';

        case 'CANCELLED':
            return 'Đã hủy';

        default:
            return 'Không xác định';
    }
};

export const getStatusClass = (status) => {
    switch (status) {
        case 'PAID':
        case 'PENDING':
            return 'status-pending';

        case 'SHIPPING':
            return 'status-shipping';

        case 'DELIVERED':
            return 'status-delivered';

        case 'CANCELLED':
            return 'status-cancelled';

        default:
            return 'status-default';
    }
};