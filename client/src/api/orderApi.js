import axiosClient from "./axiosClient";

const orderApi = {
    createOrder: (data) => {
        return axiosClient.post('/orders/create', data);
    },

    lookupOrder: (orderCode) => {
        return axiosClient.get(`/orders/lookup/${orderCode}`);
    },

    getMyOrders: () => {
        return axiosClient.get('/orders/my-orders');
    },

    getOrderDetail: (id) => {
        return axiosClient.get(`/orders/get-order-detail/${id}`);
    },

    getAllOrders: () => {
        return axiosClient.get('/orders/get-all-orders');
    },

    updateStatus: (orderId, status) => {
        return axiosClient.put(`/orders/update-status/${orderId}`, {status});
    },

    cancel: (orderCode) => {
        return axiosClient.put(`/orders/cancel/${orderCode}`);
    },
}

export default orderApi;