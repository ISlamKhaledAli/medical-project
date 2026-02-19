import { Router } from "express";

const router = Router();

router.get("/");
router.patch("/:id/read");
router.delete("/:id");

export default router;