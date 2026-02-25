import * as specialtyService from "../services/specialty.service.js";
import wrapAsync from "../middleware/asyncHandler.js";

export const createSpecialty = wrapAsync(async (req, res) => {
  const specialty = await specialtyService.createSpecialty(req.body);
  res.status(201).json({ success: true, data: specialty });
});

export const getAllSpecialties = wrapAsync(async (req, res) => {
  const specialties = await specialtyService.fetchSpecialties();
  res.json({ success: true, data: specialties });
});

export const getSpecialtyById = wrapAsync(async (req, res) => {
  const specialty = await specialtyService.fetchSpecialtyById(req.params.id);
  res.json({ success: true, data: specialty });
});

export const updateSpecialty = wrapAsync(async (req, res) => {
  const specialty = await specialtyService.updateSpecialty(
    req.params.id,
    req.body
  );
  res.json({ success: true, data: specialty });
});

export const deleteSpecialty = wrapAsync(async (req, res) => {
  await specialtyService.deleteSpecialty(req.params.id);
  res.json({ success: true, message: "Deleted successfully" });
});