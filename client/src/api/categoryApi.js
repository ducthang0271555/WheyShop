import axiosClient from "./axiosClient";

const categoryApi = {
    getAll: (params) => {
        return axiosClient.get('/categories/get-all-categories', {params})
    },

    create: (name) => {
            return axiosClient.post('/categories/create-category', {name})
    },

    update: (id, name) => {
        return axiosClient.put(`/categories/update-category/${id}`, {name})
    },

    delete: (id) => {
        return axiosClient.delete(`/categories/delete-category/${id}`)
    }
}

export default categoryApi;