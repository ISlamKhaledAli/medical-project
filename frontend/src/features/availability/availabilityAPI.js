import axiosInstance from "../../api/axiosInstance";
import { ENDPOINTS } from "../../api/endpoints";

const availabilityAPI = {
    /**
     * Fetch available slots for a doctor on a specific date
     */
    fetchSlots: (doctorId, date) => axiosInstance.get(ENDPOINTS.AVAILABILITY.DOCTOR(doctorId), { params: { date } }),

    /**
     * Create a new availability range
     */
    create: (data) => axiosInstance.post(ENDPOINTS.AVAILABILITY.SET, data),

    /**
     * Update an availability range
     */
    update: (id, data) => axiosInstance.patch(ENDPOINTS.AVAILABILITY.UPDATE(id), data),

    /**
     * Delete an availability range
     */
    delete: (id) => axiosInstance.delete(ENDPOINTS.AVAILABILITY.DELETE(id)),
};

export default availabilityAPI;
