import axiosInstance from "../../api/axiosInstance";
import { ENDPOINTS } from "../../api/endpoints";

const authAPI = {
    login: (credentials) => axiosInstance.post(ENDPOINTS.AUTH.LOGIN, credentials),

    register: (data) => axiosInstance.post(ENDPOINTS.AUTH.REGISTER, data),

    getMe: () => axiosInstance.get(ENDPOINTS.AUTH.ME),

    logout: () => axiosInstance.post(ENDPOINTS.AUTH.LOGOUT),

    forgotPassword: (email) => axiosInstance.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email }),

    resetPassword: (data) => axiosInstance.put(ENDPOINTS.AUTH.RESET_PASSWORD(data.token), { password: data.password }),

    resendVerification: (email) => axiosInstance.post(ENDPOINTS.AUTH.RESEND_VERIFICATION, { email }),

    updateProfile: (data) => axiosInstance.patch(ENDPOINTS.USER.PROFILE, data),

    changePassword: (data) => axiosInstance.patch(ENDPOINTS.USER.CHANGE_PASSWORD, data),
};

export default authAPI;