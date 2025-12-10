import axiosClient from "./axiosClient";

const productApi = {
    getAll: (params) => {
        return axiosClient.get('/products/get-all-products', {params});
    },

    get: (id) => {
        return axiosClient.get(`/products/get-product/${id}`);
    },

    getProductPublic: (id) => {
        return axiosClient.get(`/products/get-product-public/${id}`)
    },

    getProductFlashSale: (params) => {
        return axiosClient.get('/products/flash-sale', {params});
    },

    getProductByCategory: (id, params) => {
        return axiosClient.get(`/products/products-by-category/${id}`, {params});
    },

    getProductByHashtag: (id, params) => {
        return axiosClient.get(`/products/hashtag/${id}`, {params});
    },

    getNewProduct: (params) => {
        return axiosClient.get('/products/new-products', {params});
    },

    searchProduct: (query) => {
        return axiosClient.get(`/products/search?q=${query}`);
    },

    create: (data) => {
        return axiosClient.post('/products/create-product', data, {
            headers: {"Content-Type": "multipart/form-data"}
        });
    },

    update: (id, data) => {
        return axiosClient.put(`/products/update-product/${id}`, data, {
            headers: {"Content-Type": "multipart/form-data"}
        });
    },

    delete: (id) => {
        return axiosClient.delete(`/products/delete-product/${id}`);
    }
}

export default productApi;