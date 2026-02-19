import { Router } from "express";

const router = Router();

router.get("/api/notifications")
router.patch("/api/notifications/:id/red")
router.delete("/api/notifications/:id")

export default router;