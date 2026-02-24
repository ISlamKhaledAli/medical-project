import axiosInstance from "../../api/axiosInstance";

const notificationAPI = {
    /**
     * Fetch all notifications for the current user
     */
    fetchNotifications: () => axiosInstance.get("/notifications"),

    /**
     * Mark a specific notification as read
     */
    markAsRead: (id) => axiosInstance.patch(`/notifications/${id}/read`),

    /**
     * Mark all notifications as read
     */
    markAllAsRead: () => axiosInstance.patch("/notifications/read-all"),
};

export default notificationAPI;
