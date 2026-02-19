import { Router } from "express";

const router = Router();

router.post("/api/appointments")
router.get("/api/appointments/my")
router.get("/api/appointments/:id")
router.patch("/api/appointments/:id")
router.delete("/api/appointments/:id")
router.patch("/api/appointments/:id/status")
router.get("/api/appointments")
export default router;
