import { Router } from "express";

const router = Router();

router.post("/api/auth/register");
router.get("/api/auth/verify-email/:token")
router.post("/api/auth/resend-verification");
router.post("/api/auth/login");
router.post("/api/auth/refresh-token");
router.post("/api/auth/logout");
router.get("/api/auth/me");

export default router;