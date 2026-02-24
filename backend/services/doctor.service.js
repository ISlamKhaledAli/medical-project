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

  return profile;
};

/**
 * Get all doctor profiles (public).
 */
export const getAllDoctors = async (queryParams = {}) => {
  const { page = 1, limit = 20, specialty } = queryParams;
  const filter = {};

  if (specialty) filter.specialty = specialty;

  const skip = (page - 1) * limit;

  const doctors = await DoctorProfile.find(filter)
    .populate("user", "fullName email")
    .populate("specialty", "name")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await DoctorProfile.countDocuments(filter);

  return {
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    data: doctors,
  };
};

/**
 * Get a single doctor profile by its _id (public).
 */
export const getDoctorById = async (doctorId) => {
  const doctor = await DoctorProfile.findById(doctorId)
    .populate("user", "fullName email")
    .populate("specialty", "name");

  if (!doctor) throw new ApiError("Doctor profile not found.", 404);
  return doctor;
};

/**
 * Update the logged-in doctor's own profile.
 */
export const updateDoctorProfile = async (userId, updates) => {
  const allowedFields = ["specialty", "bio", "experienceYears", "consultationFee", "address"];
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
    { new: true, runValidators: true }
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
