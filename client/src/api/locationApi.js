import axios from "axios";

const BASE_URL = "https://provinces.open-api.vn/api";

const locationApi = {
    getAllProvinces: () => {
        return axios.get(`${BASE_URL}/p/`);
    },

    getDistricts: (provinceCode) => {
        return axios.get(`${BASE_URL}/p/${provinceCode}?depth=2`);
    },

    getWards: (districtCode) => {
        return axios.get(`${BASE_URL}/d/${districtCode}?depth=2`);
    }
};

export default locationApi;