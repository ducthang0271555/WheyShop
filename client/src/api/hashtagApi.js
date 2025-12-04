import axiosClient from "./axiosClient";

const hashtagApi = {
    getAll: (params) => {
        return axiosClient.get('/hash_tags/get-all-hash-tags', {params})
    },

    create: (data) => {
        return axiosClient.post('/hash_tags/create-hash-tag', data, {
            headers: {"Content-Type": "multipart/form-data"}
        });
    },

    update: (id, data) => {
        return axiosClient.put(`/hash_tags/update-hash-tag/${id}`, data, {
            headers: {"Content-Type": "multipart/form-data"}
        });
    },

    delete: (id) => {
        return axiosClient.delete(`/hash_tags/delete-hash-tag/${id}`);
    }
}

export default hashtagApi;