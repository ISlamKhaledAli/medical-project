import { Router } from "express";

const router = Router();

router.post("/api/availability");
router.get("/api/availability/:doctorId");
router.patch("/api/availability/:id");
router.delete("/api/availability/:id");

export default router;