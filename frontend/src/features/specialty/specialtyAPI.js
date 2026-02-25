import axiosInstance from "../../api/axiosInstance";
import { ENDPOINTS } from "../../api/endpoints";

export const getSpecialtiesAPI = async () => {
  const { data } = await axiosInstance.get(ENDPOINTS.SPECIALTY.LIST);
  return data;
};

export const createSpecialtyAPI = async (body) => {
  const { data } = await axiosInstance.post(
    ENDPOINTS.SPECIALTY.CREATE,
    body
  );
  return data;
};

export const deleteSpecialtyAPI = async (id) => {
  const { data } = await axiosInstance.delete(
    ENDPOINTS.SPECIALTY.DELETE(id)
  );
  return data;
};

export const updateSpecialtyAPI = async (id, body) => {
  const { data } = await axiosInstance.patch(
    ENDPOINTS.SPECIALTY.UPDATE(id),
    body
  );
  return data;
};