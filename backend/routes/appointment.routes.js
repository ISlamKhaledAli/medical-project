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
    deleteAppointmentHandler,
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

router.patch(
    "/:id/cancel",
    protect,
    cancelAppointmentHandler
);

router.patch(
    "/:id/reschedule",
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

router.delete(
    "/:id",
    protect,
    authorize("admin"),
    deleteAppointmentHandler
);

export default router;
