import { Router } from "express";

const router = Router();

router.get("/profile");
router.patch("/profile");
router.delete("/profile");

export default router;