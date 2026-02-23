import {
    getUserNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
} from "../services/notification.service.js";
import wrapAsync from "../middleware/asyncHandler.js";

//GET /api/notifications
   

export const getMyNotifications = wrapAsync(async (req, res) => {
    const result = await getUserNotifications({
        userId: req.user._id,
        queryParams: req.query,
    });

    res.json({
        success: true,
        ...result,
    });
});


 //  PATCH /api/notifications/:id/read

export const markNotificationAsRead = wrapAsync(async (req, res) => {
    const notification = await markAsRead({
        notificationId: req.params.id,
        userId: req.user._id,
    });

    res.json({
        success: true,
        data: notification,
    });
});


//PATCH /api/notifications/read-all

export const markAllNotificationsAsRead = wrapAsync(async (req, res) => {
    const result = await markAllAsRead({
        userId: req.user._id,
    });

    res.json({
        success: true,
        data: result,
    });
});


//DELETE /api/notifications/:id

export const deleteNotificationHandler = wrapAsync(async (req, res) => {
    const result = await deleteNotification({
        notificationId: req.params.id,
        userId: req.user._id,
    });

    res.json({
        success: true,
        ...result,
    });
});
