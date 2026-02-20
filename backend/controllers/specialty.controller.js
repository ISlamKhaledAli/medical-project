import * as specialtyService from "../services/specialty.service.js";

export const createSpecialty = async (req, res, next) => {
  try {
    const specialty = await specialtyService.createSpecialty(req.body);
    res.status(201).json({ success: true, data: specialty });
  } catch (err) {
    next(err);
  }
};

export const getAllSpecialties = async (req, res, next) => {
  try {
    const specialties = await specialtyService.fetchSpecialties();
    res.json({ success: true, data: specialties });
  } catch (err) {
    next(err);
  }
};

export const getSpecialtyById = async (req, res, next) => {
  try {
    const specialty = await specialtyService.fetchSpecialtyById(
      req.params.id
    );
    res.json({ success: true, data: specialty });
  } catch (err) {
    next(err);
  }
};

export const updateSpecialty = async (req, res, next) => {
  try {
    const specialty = await specialtyService.updateSpecialty(
      req.params.id,
      req.body
    );
    res.json({ success: true, data: specialty });
  } catch (err) {
    next(err);
  }
};

export const deleteSpecialty = async (req, res, next) => {
  try {
    await specialtyService.deleteSpecialty(req.params.id);
    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    next(err);
  }
};