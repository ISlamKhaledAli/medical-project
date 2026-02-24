import Specialty from "../models/Specialty.model.js";
import DoctorProfile from "../models/Doctor.model.js";

export const createSpecialty = (data) =>
  Specialty.create(data);

export const fetchSpecialties = () =>
  Specialty.find({ isActive: true });

export const fetchSpecialtyById = (id) =>
  Specialty.findById(id);

export const updateSpecialty = (id, data) =>
  Specialty.findByIdAndUpdate(id, data, { new: true });

/* 🔥 Prevent deleting specialty with doctors */
export const deleteSpecialty = async (id) => {
  const doctors = await DoctorProfile.find({ specialty: id });

  if (doctors.length > 0) {
    throw new Error("Cannot delete specialty with assigned doctors");
  }

  return await Specialty.findByIdAndDelete(id);
};