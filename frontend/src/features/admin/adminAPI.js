import axiosInstance from "../../api/axiosInstance";
import { ENDPOINTS } from "../../api/endpoints";

const adminAPI = {
    /**
     * Fetch all users with pagination and filters
     */
    fetchUsers: (params) => axiosInstance.get(ENDPOINTS.ADMIN.USERS, { params }),

    /**
     * Toggle user status (Approve/Block)
     */
    toggleUserStatus: (id, status) => {
        let endpoint;
        if (status === "approved") endpoint = ENDPOINTS.ADMIN.APPROVE_USER(id);
        else if (status === "rejected") endpoint = ENDPOINTS.ADMIN.REJECT_USER(id);
        else if (status === "blocked") endpoint = ENDPOINTS.ADMIN.BLOCK_USER(id);
        else endpoint = ENDPOINTS.ADMIN.UNBLOCK_USER(id);

        return axiosInstance.patch(endpoint);
    },

    /**
     * Fetch all appointments (Admin view)
     */
    fetchAllAppointments: (params) => axiosInstance.get(ENDPOINTS.APPOINTMENT.LIST, { params }),

    /**
     * Fetch dashboard statistics
     */
    fetchStats: () => axiosInstance.get(ENDPOINTS.APPOINTMENT.STATS),
};

export default adminAPI;
