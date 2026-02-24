import axiosInstance from "../../api/axiosInstance";

const availabilityAPI = {
    /**
     * Fetch available slots for a doctor on a specific date
     * @param {string} doctorId 
     * @param {string} date - ISO date string (YYYY-MM-DD)
     */
    fetchSlots: (doctorId, date) => axiosInstance.get(`/availability/${doctorId}`, { params: { date } }),

    /**
     * Create a new availability range
     * @param {Object} data - { dayOfWeek, startTime, endTime, slotDuration }
     */
    create: (data) => axiosInstance.post("/availability", data),

    /**
     * Update an availability range
     * @param {string} id 
     * @param {Object} data 
     */
    update: (id, data) => axiosInstance.patch(`/availability/${id}`, data),

    /**
     * Delete an availability range
     * @param {string} id 
     */
    delete: (id) => axiosInstance.delete(`/availability/${id}`),
};

export default availabilityAPI;
