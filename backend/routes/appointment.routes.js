import { Router } from "express";
import {
    bookAppointment,
    updateAppointmentStatus,
    cancelAppointmentHandler,
    rescheduleAppointmentHandler,
    getMyAppointmentsHandler,
    getAllAppointmentsHandler,
    getAppointmentStatsHandler,
    getAppointmentByIdHandler,
} from "../controllers/appointment.controller.js";

import { protect, authorize } from "../middleware/auth.middleware.js";

const router = Router();

router.post(
    "/",
    protect,
    authorize("patient"),
    bookAppointment
);

router.patch(
    "/:id/status",
    protect,
    authorize("doctor", "admin"),
    updateAppointmentStatus
);

router.delete(
    "/:id",
    protect,
    cancelAppointmentHandler
);

router.patch(
    "/:id",
    protect,
    rescheduleAppointmentHandler
);

router.get(
    "/my",
    protect,
    getMyAppointmentsHandler
);

router.get(
    "/",
    protect,
    authorize("admin"),
    getAllAppointmentsHandler
);

router.get(
    "/stats",
    protect,
    authorize("admin"),
    getAppointmentStatsHandler
);

router.get(
    "/:id",
    protect,
    getAppointmentByIdHandler
);

export default router;
