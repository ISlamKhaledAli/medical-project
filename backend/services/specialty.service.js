import Specialty from "../models/specialties.model.js";
import DoctorProfile from "../models/Doctor.model.js";
import ApiError from "../utils/ApiError.js";

export const createSpecialty = async (data) => {
  // Case-insensitive check for existing specialty
  const existingSpecialty = await Specialty.findOne({
    name: { $regex: new RegExp(`^${data.name}$`, "i") },
  });

  if (existingSpecialty) {
    throw new ApiError("Specialty with this name already exists", 409);
  }

  return Specialty.create(data);
};

export const fetchSpecialties = () => Specialty.find({ isActive: true });

export const fetchSpecialtyById = (id) => Specialty.findById(id);

export const updateSpecialty = async (id, data) => {
  // Case-insensitive check for existing specialty (excluding current one)
  if (data.name) {
    const existingSpecialty = await Specialty.findOne({
      name: { $regex: new RegExp(`^${data.name}$`, "i") },
      _id: { $ne: id },
    });

    if (existingSpecialty) {
      throw new ApiError("Specialty with this name already exists", 409);
    }
  }

  return Specialty.findByIdAndUpdate(id, data, { new: true });
};

/* 🔥 Prevent deleting specialty with doctors */
export const deleteSpecialty = async (id) => {
  const doctors = await DoctorProfile.find({ specialty: id });

  if (doctors.length > 0) {
    throw new ApiError("Cannot delete specialty with assigned doctors", 400);
  }

  return await Specialty.findByIdAndDelete(id);
};
