import { Router } from "express";
import {
    setAvailability,
    updateAvailabilityHandler,
    deleteAvailabilityHandler,
    getDoctorAvailabilityHandler,
} from "../controllers/availability.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = Router();

router.post(
    "/",
    protect,
    authorize("doctor"),
    setAvailability
);

router.patch(
    "/:id",
    protect,
    authorize("doctor"),
    updateAvailabilityHandler
);

router.delete(
    "/:id",
    protect,
    authorize("doctor"),
    deleteAvailabilityHandler
);

router.get(
    "/:doctorId",
    getDoctorAvailabilityHandler
);

export default router;
