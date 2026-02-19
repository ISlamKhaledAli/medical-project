import { Router } from "express";

const router = Router();

router.post("/api/doctors/profile");
router.get("/api/doctors");
router.get("/api/doctors/:id");
router.patch("/api/doctors/profile");
router.delete("/api/doctors/profile");

export default router;
