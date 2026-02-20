import * as doctorService from "../services/doctor.service.js";

export const createDoctorProfile = async (req, res, next) => {
  try {
    const doctor = await doctorService.createProfile(req.body);
    res.status(201).json({ success: true, data: doctor });
  } catch (err) {
    next(err);
  }
};

export const updateDoctorProfile = async (req, res, next) => {
  try {
    const doctor = await doctorService.updateProfile(
      req.params.id,
      req.body
    );
    res.json({ success: true, data: doctor });
  } catch (err) {
    next(err);
  }
};

export const deleteDoctorProfile = async (req, res, next) => {
  try {
    await DoctorProfile.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Doctor deleted" });
  } catch (err) {
    next(err);
  }
};

export const getAllDoctors = async (req, res, next) => {
  try {
    const result = await doctorService.fetchDoctorsWithFilters(req.query);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

export const getDoctorById = async (req, res, next) => {
  try {
    const doctor = await doctorService.fetchDoctorById(req.params.id);
    res.json({ success: true, data: doctor });
  } catch (err) {
    next(err);
  }
};

export const getDoctorAppointments = async (req, res, next) => {
  try {
    const appointments = await doctorService.fetchDoctorAppointments(
      req.params.id
    );
    res.json({ success: true, data: appointments });
  } catch (err) {
    next(err);
  }
};

export const getDoctorsBySpecialty = async (req, res, next) => {
  try {
    const result = await doctorService.fetchDoctorsWithFilters({
      specialty: req.params.specialtyId,
    });
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};