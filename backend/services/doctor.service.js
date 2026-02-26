import DoctorProfile from "../models/Doctor.model.js";
import User from "../models/User.model.js";
import ApiError from "../utils/ApiError.js";

/**
 * Create a doctor profile for the logged-in user (role must be "doctor").
 */
export const createDoctorProfile = async (userId, data) => {
  const existing = await DoctorProfile.findOne({ user: userId });
  if (existing) {
    throw new ApiError("Doctor profile already exists.", 409);
  }

  const profile = await DoctorProfile.create({
    user: userId,
    specialty: data.specialty,
    bio: data.bio,
    experienceYears: data.experienceYears,
    consultationFee: data.consultationFee,
    address: data.address,
  });

  // Atomically update user profile flag
  await User.findByIdAndUpdate(userId, { profileComplete: true });

  return profile;
};

/**
 * Get the doctor profile for the logged-in user.
 */
export const getDoctorProfile = async (userId) => {
  const profile = await DoctorProfile.findOne({ user: userId })
    .populate("user", "fullName email")
    .populate("specialty", "name");

  if (!profile) throw new ApiError("Doctor profile not found.", 404);
  return profile;
};

/**
 * Get all doctor profiles (public).
 */
export const getAllDoctors = async (queryParams = {}) => {
  const { page = 1, limit = 20, specialty } = queryParams;
  const filter = {};

  if (specialty && specialty !== "" && specialty !== "all" && specialty !== "undefined") {
    filter.specialty = specialty;
  }

  const skip = (page - 1) * limit;

  // IMPORTANT: Only return doctors whose associated user is approved
  const doctors = await DoctorProfile.find(filter)
    .populate({
      path: "user",
      match: { status: "approved" },
      select: "fullName email status"
    })
    .populate("specialty", "name")
    .sort({ createdAt: -1 });

  // Filter out any profiles where the populated user is null (meaning not approved)
  const approvedDoctors = doctors.filter(doc => doc.user !== null);

  const paginatedDoctors = approvedDoctors.slice(skip, skip + Number(limit));

  return {
    total: approvedDoctors.length,
    page: Number(page),
    pages: Math.ceil(approvedDoctors.length / limit),
    data: paginatedDoctors,
  };
};

/**
 * Get a single doctor profile by its _id (public).
 */
export const getDoctorById = async (doctorId) => {
  // Try finding by DoctorProfile _id first
  let doctor = await DoctorProfile.findById(doctorId)
    .populate("user", "fullName email status")
    .populate("specialty", "name");

  // Fallback: If not found, try finding by the associated User ID
  if (!doctor) {
    doctor = await DoctorProfile.findOne({ user: doctorId })
      .populate("user", "fullName email status")
      .populate("specialty", "name");
  }

  if (!doctor) throw new ApiError("Doctor profile not found.", 404);

  // Public check: Only approved doctors details should be public
  if (doctor.user?.status !== "approved") {
    throw new ApiError("Doctor not yet available for consultation.", 403);
  }

  return doctor;
};

/**
 * Update the logged-in doctor's own profile.
 */
export const updateDoctorProfile = async (userId, updates) => {
  const allowedFields = [
    "specialty",
    "bio",
    "experienceYears",
    "consultationFee",
    "address",
  ];
  const filtered = {};

  allowedFields.forEach((field) => {
    if (updates[field] !== undefined) {
      filtered[field] = updates[field];
    }
  });

  if (Object.keys(filtered).length === 0) {
    throw new ApiError("No valid fields provided to update.", 400);
  }

  const profile = await DoctorProfile.findOneAndUpdate(
    { user: userId },
    filtered,
    { new: true, runValidators: true },
  )
    .populate("user", "fullName email")
    .populate("specialty", "name");

  if (!profile) throw new ApiError("Doctor profile not found.", 404);
  return profile;
};

/**
 * Delete the logged-in doctor's own profile.
 */
export const deleteDoctorProfile = async (userId) => {
  const profile = await DoctorProfile.findOneAndDelete({ user: userId });
  if (!profile) throw new ApiError("Doctor profile not found.", 404);
};
