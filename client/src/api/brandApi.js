import axiosClient from "./axiosClient"

const brandApi = {
    getAll: (params) => {
        return axiosClient.get('/brands/get-all-brands', {params});
    },

    create: (name) => {
        return axiosClient.post('/brands/create-brand', {name});
    },

    update: (id, name) => {
        return axiosClient.put(`/brands/update-brand/${id}`, {name});
    },

    delete: (id) => {
        return axiosClient.delete(`/brands/delete-brand/${id}`);
    }
}

export default brandApi;