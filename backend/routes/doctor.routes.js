import { Router } from "express";
import {
  createDoctorProfile,
  updateDoctorProfile,
  deleteDoctorProfile,
  getAllDoctors,
  getDoctorById,
} from "../controllers/doctor.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = Router();

/* ========================
   CREATE PROFILE
======================== */
router.post("/profile", protect, createDoctorProfile);

/* ========================
   GET ALL DOCTORS
======================== */
router.get("/", getAllDoctors);

/* ========================
   GET SINGLE DOCTOR
======================== */
router.get("/:id", getDoctorById);

/* ========================
   UPDATE PROFILE
======================== */
router.patch("/profile", protect, updateDoctorProfile);

/* ========================
   DELETE PROFILE
======================== */
router.delete("/profile", protect, deleteDoctorProfile);

export default router;