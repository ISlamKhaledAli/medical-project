import axiosInstance from "../../api/axiosInstance";
import { ENDPOINTS } from "../../api/endpoints";

export const getSpecialtiesAPI = async () => {
  const { data } = await axiosInstance.get(ENDPOINTS.SPECIALTIES);
  return data;
};

export const createSpecialtyAPI = async (body) => {
  const { data } = await axiosInstance.post(
    ENDPOINTS.SPECIALTIES,
    body
  );
  return data;
};

export const deleteSpecialtyAPI = async (id) => {
  const { data } = await axiosInstance.delete(
    `${ENDPOINTS.SPECIALTIES}/${id}`
  );
  return data;
};