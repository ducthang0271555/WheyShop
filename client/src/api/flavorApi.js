import axiosClient from "./axiosClient";

const flavorApi = {
    getFlavorsByProduct: (productId) => {
        return axiosClient.get(`/product_flavors/get-flavors/${productId}`);
    },

    getFlavor: (id) => {
        return axiosClient.get(`/product_flavors/get-flavor/${id}`);
    },

    create: (productId, data) => {
        return axiosClient.post(`/product_flavors/create-flavor/${productId}`, data, {
            headers: {"Content-Type": "multipart/form-data"}
        });
    },

    update: (id, data) => {
        return axiosClient.put(`/product_flavors/update-flavor/${id}`, data, {
            headers: {"Content-Type": "multipart/form-data"}
        });
    },

    delete: (id) => {
        return axiosClient.delete(`/product_flavors/delete-flavor/${id}`);
    },
}

export default flavorApi;