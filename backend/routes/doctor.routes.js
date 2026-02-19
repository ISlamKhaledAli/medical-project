import { Router } from "express";

const router = Router();

router.post("/profile");
router.get("/");
router.get("/:id");
router.patch("/profile");
router.delete("/profile");

export default router;
