import axiosInstance from "../../api/axiosInstance";

const adminAPI = {
    /**
     * Fetch all users with pagination and filters
     */
    fetchUsers: (params) => axiosInstance.get("/admin/users", { params }),

    /**
     * Toggle user status (Approve/Block)
     */
    toggleUserStatus: (id, status) => axiosInstance.patch(`/admin/users/${id}/status`, { status }),

    /**
     * Fetch all appointments (Admin view)
     */
    fetchAllAppointments: (params) => axiosInstance.get("/admin/appointments", { params }),

    /**
     * Fetch dashboard statistics
     */
    fetchStats: () => axiosInstance.get("/admin/stats"),
};

export default adminAPI;
