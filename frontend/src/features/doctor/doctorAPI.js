import axiosInstance from "../../api/axiosInstance";
import { ENDPOINTS } from "../../api/endpoints";

const doctorAPI = {
    /**
     * Fetch doctors with filters and pagination
     */
    fetchDoctors: ({ signal, ...params }) => axiosInstance.get(ENDPOINTS.DOCTOR.LIST, { params, signal }),

    /**
     * Fetch a single doctor by ID
     */
    fetchDoctorById: (id) => axiosInstance.get(ENDPOINTS.DOCTOR.DETAILS(id)),

    /**
     * Get the logged-in doctor's profile
     */
    fetchMyProfile: () => axiosInstance.get(ENDPOINTS.DOCTOR.UPDATE_PROFILE),

    /**
     * Create doctor profile
     */
    createProfile: (data) => axiosInstance.post(ENDPOINTS.DOCTOR.UPDATE_PROFILE, data),

    /**
     * Update doctor profile
     */
    updateProfile: (data) => axiosInstance.patch(ENDPOINTS.DOCTOR.UPDATE_PROFILE, data),
};

export default doctorAPI;
