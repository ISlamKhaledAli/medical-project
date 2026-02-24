export const selectAllDoctors = (state) => state.doctor.doctorsList;
export const selectSelectedDoctor = (state) => state.doctor.selectedDoctor; // FIXED 1.7
export const selectAllSpecialties = (state) => state.doctor.specialtiesList;
export const selectDoctorLoading = (state) => state.doctor.loading;
export const selectDoctorError = (state) => state.doctor.error;
export const selectDoctorPagination = (state) => state.doctor.pagination;
export const selectSpecialtiesLoading = (state) =>
  state.doctor.specialtiesLoading; // FIXED 1.8
export const selectSpecialtiesError = (state) => state.doctor.specialtiesError; // FIXED 1.9
