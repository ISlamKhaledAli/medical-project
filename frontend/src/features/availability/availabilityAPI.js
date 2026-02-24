import axiosInstance from "../../api/axiosInstance";
import { ENDPOINTS } from "../../api/endpoints";

export const getDoctorAvailabilityAPI = async (doctorId) => {
  const { data } = await axiosInstance.get(
    ENDPOINTS.DOCTOR_AVAILABILITY(doctorId)
  );
  return data;
};