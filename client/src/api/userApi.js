import axiosClient from "./axiosClient";

const userApi = {
    getAll: (params) => {
        return axiosClient.get('/users/get-all-users');
    },

    login: (data) => {
        return axiosClient.post('/users/login', data);
    },

    getProfile: () => {
        return axiosClient('/users/dashboard');
    },

    register: (data) => {
        return axiosClient.post('/users/register', data);
    },

    changePassword: (data) => {
        return axiosClient.post('/users/change-password', data);
    },

    forgotPassword: (username) => {
        return axiosClient.post('/users/forgot-password', {username});
    },

    verifyOtp: (data) => {
        return axiosClient.post('/users/verify-otp', data);
    },

    resendOtp: (username) => {
        return axiosClient.post('/users/resend-otp', {username})
    },

    resetPassword: (data, token) => {
        return axiosClient.post('/users/reset-password', data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }
}

export default userApi;