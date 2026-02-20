import axiosInstance from "../../api/axiosInstance";

const authAPI = {
    login: (credentials) => axiosInstance.post("/auth/login", credentials),

    register: (data) => axiosInstance.post("/auth/register", data),

    getMe: () => axiosInstance.get("/auth/me"),

    logout: () => axiosInstance.post("/auth/logout"),

    forgotPassword: (email) => axiosInstance.post("/auth/forgot-password", { email }),

    resetPassword: (data) => axiosInstance.post(`/auth/reset-password/${data.token}`, { password: data.password }),

    resendVerification: (email) => axiosInstance.post("/auth/resend-verification", { email }),
};

export default authAPI;