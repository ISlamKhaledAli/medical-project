import axiosInstance from "../../api/axiosInstance";
import { ENDPOINTS } from "../../api/endpoints";

export const getDoctorsAPI = async (params) => {
  const { data } = await axiosInstance.get(ENDPOINTS.DOCTORS, { params });
  return data;
};

export const getDoctorByIdAPI = async (id) => {
  const { data } = await axiosInstance.get(
    ENDPOINTS.DOCTOR_BY_ID(id)
  );
  return data;
};