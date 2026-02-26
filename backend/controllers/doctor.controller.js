import * as doctorService from "../services/doctor.service.js";
import wrapAsync from "../middleware/asyncHandler.js";

export const createDoctorProfile = wrapAsync(async (req, res) => {
  const doctor = await doctorService.createDoctorProfile(req.user._id, req.body);
  res.status(201).json({ success: true, data: doctor });
});

export const getDoctorProfile = wrapAsync(async (req, res) => {
  const doctor = await doctorService.getDoctorProfile(req.user._id);
  res.json({ success: true, data: doctor });
});

export const updateDoctorProfile = wrapAsync(async (req, res) => {
  const doctor = await doctorService.updateDoctorProfile(
    req.user._id,
    req.body
  );
  res.json({ success: true, data: doctor });
});

export const deleteDoctorProfile = wrapAsync(async (req, res) => {
  await doctorService.deleteDoctorProfile(req.user._id);
  res.json({ success: true, message: "Doctor deleted" });
});

export const getAllDoctors = wrapAsync(async (req, res) => {
  const result = await doctorService.getAllDoctors(req.query);
  res.json({ success: true, ...result });
});

export const getDoctorById = wrapAsync(async (req, res) => {
  const doctor = await doctorService.getDoctorById(req.params.id);
  res.json({ success: true, data: doctor });
});

export const getDoctorAppointments = wrapAsync(async (req, res) => {
  const appointments = await doctorService.fetchDoctorAppointments(
    req.params.id
  );
  res.json({ success: true, data: appointments });
});

export const getDoctorsBySpecialty = wrapAsync(async (req, res) => {
  const result = await doctorService.fetchDoctorsWithFilters({
    specialty: req.params.specialtyId,
  });
  res.json({ success: true, ...result });
});