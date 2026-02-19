import { Router } from "express";

const router = Router();

router.post("/api/specialties");
router.get("/api/specialties");
router.get("/api/specialties/:id");
router.patch("/api/specialties/:id");
router.delete("/api/specialties/:id");

export default router;