import axiosClient from "./axiosClient";

const orderApi = {
    createOrder: (data) => {
        return axiosClient.post('/orders/create', data);
    },

}

export default orderApi;