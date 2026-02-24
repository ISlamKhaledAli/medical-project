import axiosInstance from "../../api/axiosInstance";

const appointmentAPI = {
    /**
     * Fetch user's appointments
     */
    fetchMy: () => axiosInstance.get("/appointments/my"),

    /**
     * Create a new appointment
     * @param {Object} data - { doctorId, date, timeSlot }
     */
    create: (data) => axiosInstance.post("/appointments", data),

    /**
     * Cancel an appointment
     * @param {string} id 
     */
    cancel: (id) => axiosInstance.patch(`/appointments/${id}/cancel`),

    /**
     * Reschedule an appointment
     * @param {string} id 
     * @param {Object} data - { date, timeSlot }
     */
    reschedule: (id, data) => axiosInstance.patch(`/appointments/${id}/reschedule`, data),

    /**
     * Update appointment status (Doctor/Admin only)
     * @param {string} id 
     * @param {string} status 
     */
    updateStatus: (id, status) => axiosInstance.patch(`/appointments/${id}/status`, { status }),
};

export default appointmentAPI;
