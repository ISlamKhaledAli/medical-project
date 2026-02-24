import axiosInstance from "../../api/axiosInstance";

const doctorAPI = {
    /**
     * Fetch doctors with filters and pagination
     * @param {Object} params - { name, specialty, page, limit, signal }
     */
    fetchDoctors: ({ signal, ...params }) => axiosInstance.get("/doctors", { params, signal }),

    /**
     * Fetch a single doctor by ID
     * @param {string} id 
     */
    fetchDoctorById: (id) => axiosInstance.get(`/doctors/${id}`),

    /**
     * Fetch all specialties
     */
    fetchSpecialties: () => axiosInstance.get("/specialties"),

    /**
     * Update doctor profile
     * @param {Object} data 
     */
    updateProfile: (data) => axiosInstance.patch("/doctors/profile", data),
};

export default doctorAPI;
