import axiosClient from "./axiosClient";

const giftApi = {
    create: (data) => {
        return axiosClient.post('/gifts/create-gift', data, {
            headers: {"Content-Type": "multipart/form-data"}
        });
    },

    getAll: (params) => {
        return axiosClient.get('gifts/get-all-gifts', {params});
    },

    update: (gift_id, data) => {
        return axiosClient.put(`/gifts/update-gift/${gift_id}`, data, {
            headers: {"Content-Type": "multipart/form-data"}
        });
    },

    delete: (gift_id) => {
        return axiosClient.delete(`/gifts/delete-gift/${gift_id}`);
    }
}

export default giftApi;