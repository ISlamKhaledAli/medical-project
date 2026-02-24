import { Router } from "express";
import {
  createSpecialty,
  getAllSpecialties,
  getSpecialtyById,
  updateSpecialty,
  deleteSpecialty,
} from "../controllers/specialty.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = Router();

/* CREATE */
router.post("/", protect, createSpecialty);

/* GET ALL */
router.get("/", getAllSpecialties);

/* GET BY ID */
router.get("/:id", getSpecialtyById);

/* UPDATE */
router.patch("/:id", protect, updateSpecialty);

/* DELETE */
router.delete("/:id", protect, deleteSpecialty);

export default router;
