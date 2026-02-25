import { Router } from "express";
import {
   createDoctorProfile,
   getDoctorProfile,
   updateDoctorProfile,
   deleteDoctorProfile,
   getAllDoctors,
   getDoctorById,
} from "../controllers/doctor.controller.js";

import { protect, authorize } from "../middleware/auth.middleware.js";

const router = Router();

/* ========================
   DOCTOR PROFILE ACTIONS
======================== */

// Create profile (Onboarding)
router.post("/profile", protect, authorize("doctor"), createDoctorProfile);

// Get my profile
router.get("/profile/me", protect, authorize("doctor"), getDoctorProfile);

// Update profile
router.patch("/profile", protect, authorize("doctor"), updateDoctorProfile);

// Delete profile
router.delete("/profile", protect, authorize("doctor"), deleteDoctorProfile);

/* ========================
   PUBLIC DOCTOR DATA
======================== */
router.get("/", getAllDoctors);
router.get("/:id", getDoctorById);

export default router;