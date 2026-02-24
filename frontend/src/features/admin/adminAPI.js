import axiosInstance from "../../api/axiosInstance";

const adminAPI = {
    /**
     * Fetch all users with pagination and filters
     */
    fetchUsers: (params) => axiosInstance.get("/admin/users", { params }),

    /**
     * Toggle user status (Approve/Block)
     */
    toggleUserStatus: (id, status) => {
        const endpoint = status === "blocked" ? "block" : "unblock";
        return axiosInstance.patch(`/admin/users/${id}/${endpoint}`);
    },

    /**
     * Fetch all appointments (Admin view)
     */
    fetchAllAppointments: (params) => axiosInstance.get("/appointments", { params }),

    /**
     * Fetch dashboard statistics
     */
    fetchStats: () => axiosInstance.get("/appointments/stats"),
};

export default adminAPI;
