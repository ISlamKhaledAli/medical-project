import Specialty from "../models/Specialty.model.js";

export const createSpecialty = (data) =>
  Specialty.create(data);

export const updateSpecialty = (id, data) =>
  Specialty.findByIdAndUpdate(id, data, { new: true });

export const deleteSpecialty = (id) =>
  Specialty.findByIdAndDelete(id);

export const fetchSpecialties = () =>
  Specialty.find({ isActive: true });