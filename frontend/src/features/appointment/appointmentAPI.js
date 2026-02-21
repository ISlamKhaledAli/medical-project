import axiosInstance from "../../api/axiosInstance";
import { ENDPOINTS } from "../../api/endpoints";

export const getAppointmentsAPI = async () => {
  const { data } = await axiosInstance.get(ENDPOINTS.APPOINTMENTS);
  return data;
};

export const createAppointmentAPI = async (body) => {
  const { data } = await axiosInstance.post(
    ENDPOINTS.APPOINTMENTS,
    body
  );
  return data;
};

export const cancelAppointmentAPI = async (id) => {
  const { data } = await axiosInstance.patch(
    `${ENDPOINTS.APPOINTMENTS}/${id}/cancel`
  );
  return data;
};