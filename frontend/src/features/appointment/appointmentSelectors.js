export const selectAppointments = (state) =>
  state.appointment.appointments;

export const selectAppointmentLoading = (state) =>
  state.appointment.isLoading;

export const selectAppointmentError = (state) =>
  state.appointment.error;

export const selectBookingSuccess = (state) =>
  state.appointment.bookingSuccess;