import axios from "axios";
import { store } from "../app/store";
import { logout, setCredentials } from "../features/auth/authSlice";
import { startGlobalLoading, stopGlobalLoading } from "../features/ui/uiSlice";
import { debugAPI } from "../utils/debugTrace";

const baseURL = import.meta.env.VITE_API_BASE_URL;

if (!baseURL) {
    throw new Error("VITE_API_BASE_URL is not defined in the environment variables.");
}

const axiosInstance = axios.create({
    baseURL,
    withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve();
        }
    });
    failedQueue = [];
};

axiosInstance.interceptors.request.use((config) => {
    debugAPI(`Request: ${config.method.toUpperCase()} ${config.url}`, config.params || config.data);
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => {
        debugAPI(`Response: ${response.status} ${response.config.url}`, response.data);
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        debugAPI(`Error: ${error.response?.status} ${originalRequest.url}`, error.response?.data);

        // Handle 401 Unauthorized - Token Refresh Flow
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                debugAPI("Token refresh already in progress, queuing request");
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => {
                        return axiosInstance(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;
            debugAPI("Starting token refresh flow");

            try {
                store.dispatch(startGlobalLoading());
                await axios.post(
                    `${baseURL}/auth/refresh-token`,
                    {},
                    { withCredentials: true }
                );

                debugAPI("Token refresh successful");

                processQueue(null);
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                debugAPI("Token refresh failed, logging out user", refreshError);
                processQueue(refreshError);
                store.dispatch(logout());
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
                store.dispatch(stopGlobalLoading());
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
