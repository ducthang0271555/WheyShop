import axiosClient from "./axiosClient";

const cartApi = {
    getCart: () => {
        return axiosClient.get('cart/get-cart');
    },

    addToCart: (data) => {
        return axiosClient.post('/cart/add-to-cart', data);
    },

    updateCart: (cartId, quantity) => {
        return axiosClient.put(`/cart/update/${cartId}`, { quantity });
    },

    deleteItem: (cartId) => {
        return axiosClient.delete(`/cart/delete/${cartId}`);
    },

    clearCart: () => {
        return axiosClient.delete('/cart/clear');
    }
}

export default cartApi;