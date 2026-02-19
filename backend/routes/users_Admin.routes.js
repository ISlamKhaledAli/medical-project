import { Router } from "express";

const router = Router();

router.get("/");
router.get("/:id");
router.patch("/:id/approve");
router.patch("/:id/block");
router.patch("/:id/unblock");
router.delete("/:id");

export default router;