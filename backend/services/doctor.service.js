import DoctorProfile from "../models/Doctor.model.js";
import Appointment from "../models/Appointments.model.js";

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

  // Filter by specialty
  if (query.specialty) {
    filter.specialty = query.specialty;
  }

  return filter;
};

/* ========================
   SORTING
======================== */

export const sortDoctors = (query) => {
  switch (query.sort) {
    case "rating":
      return { rating: -1 };
    case "experience":
      return { experienceYears: -1 };
    case "newest":
      return { createdAt: -1 };
    default:
      return { createdAt: -1 };
  }
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
  const sortOption = sortDoctors(query);
  const { page, limit, skip } = paginateDoctors(query);

  let doctors = await DoctorProfile.find(filter)
    .populate("specialty", "name")
    .populate("user", "name email")
    .sort(sortOption)
    .skip(skip)
    .limit(limit);

  // 🔥 Search by doctor name (Regex)
  if (query.name) {
    const search = query.name.toLowerCase();
    doctors = doctors.filter((doc) =>
      doc.user?.name?.toLowerCase().includes(search)
    );
  }

  const total = await DoctorProfile.countDocuments(filter);

  return {
    total,
    page,
    totalPages: Math.ceil(total / limit),
    results: doctors.length,
    data: doctors,
  };
};

/* ========================
   SINGLE DOCTOR
======================== */

export const fetchDoctorById = (id) =>
  DoctorProfile.findById(id)
    .populate("specialty", "name")
    .populate("user", "name email");

/* ========================
   DOCTOR APPOINTMENTS
======================== */

export const fetchDoctorAppointments = async (doctorId) => {
  return await Appointment.find({ doctor: doctorId })
    .populate("patient", "name email")
    .sort({ createdAt: -1 });
};