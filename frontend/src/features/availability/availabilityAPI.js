import axiosInstance from "../../api/axiosInstance";
import { ENDPOINTS } from "../../api/endpoints";

const availabilityAPI = {
    /**
     * Fetch available slots for a doctor on a specific date
     */
    fetchSlots: (doctorId, date) => axiosInstance.get(ENDPOINTS.AVAILABILITY.DOCTOR(doctorId), { params: { date } }),

    /**
     * Set bulk weekly availability
     */
    saveWeekly: (scheduleData) => {
        const payload = {
            availability: scheduleData.map(day => ({
                dayOfWeek: day.dayOfWeek,
                startTime: typeof day.startTime === "string"
                    ? day.startTime
                    : day.startTime?.format?.("HH:mm") || "09:00",
                endTime: typeof day.endTime === "string"
                    ? day.endTime
                    : day.endTime?.format?.("HH:mm") || "17:00",
                slotDurationMinutes: day.slotDuration || 30,
                isActive: day.isActive
            }))
        };
        return axiosInstance.post(ENDPOINTS.AVAILABILITY.SET, payload);
    },

    /**
     * Create a new availability range (Legacy)
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
