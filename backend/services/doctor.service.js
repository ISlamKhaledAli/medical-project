import DoctorProfile from "../models/Doctor.model.js";

/* ========================
   CREATE & UPDATE
======================== */

export const createProfile = (data) =>
  DoctorProfile.create(data);

export const updateProfile = (id, data) =>
  DoctorProfile.findByIdAndUpdate(id, data, { new: true });

/* ========================
   FILTERING
======================== */

export const filterDoctors = (query) => {
  const filter = { isApproved: true };

  if (query.specialty) {
    filter.specialty = query.specialty;
  }

  return filter;
};

/* ========================
   PAGINATION
======================== */

export const paginateDoctors = (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

/* ========================
   FETCH WITH FILTERS
======================== */

export const fetchDoctorsWithFilters = async (query) => {
  const filter = filterDoctors(query);
  const { page, limit, skip } = paginateDoctors(query);

  const doctors = await DoctorProfile.find(filter)
    .populate("specialty")
    .populate("user", "name email")
    .skip(skip)
    .limit(limit);

  const total = await DoctorProfile.countDocuments(filter);

  return {
    total,
    page,
    totalPages: Math.ceil(total / limit),
    data: doctors,
  };
};

/* ========================
   SINGLE DOCTOR
======================== */

export const fetchDoctorById = (id) =>
  DoctorProfile.findById(id)
    .populate("specialty")
    .populate("user", "name email");

/* ========================
   DOCTOR APPOINTMENTS
======================== */

export const fetchDoctorAppointments = async (doctorId) => {
  return await Appointment.find({ doctor: doctorId });
};