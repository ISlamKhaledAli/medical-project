import axiosInstance from "../../api/axiosInstance";
import { ENDPOINTS } from "../../api/endpoints";

const notificationAPI = {
    /**
     * Fetch all notifications for the current user
     */
    fetchNotifications: () => axiosInstance.get(ENDPOINTS.NOTIFICATION.LIST),

    /**
     * Mark a specific notification as read
     */
    markAsRead: (id) => axiosInstance.patch(ENDPOINTS.NOTIFICATION.MARK_AS_READ(id)),

    /**
     * Mark all notifications as read
     */
    markAllAsRead: () => axiosInstance.patch(ENDPOINTS.NOTIFICATION.MARK_ALL_READ),
};

export default notificationAPI;
