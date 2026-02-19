import { Router } from "express";

const router = Router();

router.get("/api/users")
router.get("/api/users/:id")
router.patch("/api/users/:id/approve")
router.patch("/api/users/:id/block")
router.patch("/api/users/:id/unblock")
router.delete("/api/users/:id")

export default router;