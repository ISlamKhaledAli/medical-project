import axiosInstance from "../../api/axiosInstance";

export const doctorAPI = {
  getAllDoctors: async ({
    page = 1,
    limit = 10,
    search = "",
    specialtyId = "",
  }) => {
    const params = {
      _page: page,
      _limit: limit,
    };

    // 'q' performs a full-text search across the object in json-server
    if (search) params.q = search;

    // Deep filter syntax for json-server
    if (specialtyId) params["specialty._id"] = specialtyId;

    const response = await axiosInstance.get("/doctors", { params });

    if (Array.isArray(response.data)) {
      return {
        data: response.data,
        pagination: {
          currentPage: page,
          totalPages: 1,
          totalRecords: response.data.length,
        },
      };
    }
    return response.data;
    // const response = await axiosInstance.get("/doctors", {
    //   params: { page, limit, search, specialty: specialtyId },
    // });
    // return response.data;
  },

  // FIXED 1.6: Added missing getDoctorById
  getDoctorById: async (doctorId) => {
    const response = await axiosInstance.get(`/doctors/${doctorId}`);
    return response.data?.data ? response.data : { data: response.data };
  },

  getAllSpecialties: async () => {
    const response = await axiosInstance.get("/specialties");
    if (Array.isArray(response.data)) {
      return { data: response.data };
    }
    return response.data;
  },
};
