import { Router } from "express";
import {
    getMyNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotificationHandler,
} from "../controllers/notification.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import validateObjectId from "../middleware/validateObjectId.js";

const router = Router();

// All notification routes require authentication
router.use(protect);

// GET /api/notifications — get current user's notifications (paginated)
router.get("/", getMyNotifications);

// PATCH /api/notifications/read-all — mark all as read (must be before /:id routes)
router.patch("/read-all", markAllNotificationsAsRead);

// PATCH /api/notifications/:id/read — mark single notification as read
router.patch("/:id/read", validateObjectId("id"), markNotificationAsRead);

// DELETE /api/notifications/:id — delete a notification
router.delete("/:id", validateObjectId("id"), deleteNotificationHandler);

export default router;
