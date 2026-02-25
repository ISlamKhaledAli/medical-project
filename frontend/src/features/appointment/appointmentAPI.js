import axiosInstance from "../../api/axiosInstance";
import { ENDPOINTS } from "../../api/endpoints";

const appointmentAPI = {
    /**
     * Fetch user's appointments
     */
    fetchMy: () => axiosInstance.get(ENDPOINTS.APPOINTMENT.MY),

    /**
     * Create a new appointment
     */
    create: (data) => axiosInstance.post(ENDPOINTS.APPOINTMENT.CREATE, data),

    /**
     * Cancel an appointment
     */
    cancel: (id) => axiosInstance.patch(ENDPOINTS.APPOINTMENT.CANCEL(id)),

    /**
     * Reschedule an appointment
     */
    reschedule: (id, data) => axiosInstance.patch(ENDPOINTS.APPOINTMENT.RESCHEDULE(id), data),

    /**
     * Update appointment status (Doctor/Admin only)
     */
    updateStatus: (id, status, doctorNotes) => axiosInstance.patch(ENDPOINTS.APPOINTMENT.UPDATE_STATUS(id), { status, ...(doctorNotes !== undefined && { notes: doctorNotes }) }),

    /**
     * Delete an appointment (Admin only)
     */
    delete: (id) => axiosInstance.delete(ENDPOINTS.APPOINTMENT.DELETE(id)),
};

export default appointmentAPI;
