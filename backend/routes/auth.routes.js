import { Router } from "express";

const router = Router();

router.post("/register");
router.get("/verify-email/:token");
router.post("/resend-verification");
router.post("/login");
router.post("/refresh-token");
router.post("/logout");
router.get("/me");

export default router;