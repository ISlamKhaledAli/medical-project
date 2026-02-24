import Notification from "../models/Notifications.model.js";
import ApiError from "../utils/ApiError.js";
import { getIO } from "../sockets/socket.js";


// Create Notification (internal)

export const createNotification = async ({ userId, type, message }) => {
    const notification = await Notification.create({
        user: userId,
        type,
        message,
    });

    // Emit real-time notification to the user's private room
    const io = getIO();
    if (io) {
        io.to(userId.toString()).emit("newNotification", {
            _id: notification._id,
            type: notification.type,
            message: notification.message,
            isRead: notification.isRead,
            createdAt: notification.createdAt,
        });
    }

    return notification;
};


 //  Get User Notifications (paginated)

export const getUserNotifications = async ({ userId, queryParams }) => {
    const { page = 1, limit = 20, isRead } = queryParams;

    const filter = { user: userId };

    if (isRead !== undefined) {
        filter.isRead = isRead === "true";
    }

    const skip = (page - 1) * limit;

    const notifications = await Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

    const total = await Notification.countDocuments(filter);
    const unreadCount = await Notification.countDocuments({
        user: userId,
        isRead: false,
    });

    return {
        total,
        unreadCount,
        page: Number(page),
        pages: Math.ceil(total / limit),
        data: notifications,
    };
};


// Mark Single Notification as Read

export const markAsRead = async ({ notificationId, userId }) => {
    const notification = await Notification.findById(notificationId);

    if (!notification) {
        throw new ApiError("Notification not found", 404);
    }

    if (notification.user.toString() !== userId.toString()) {
        throw new ApiError("Not authorized to access this notification", 403);
    }

    notification.isRead = true;
    await notification.save();

    return notification;
};

//Mark All Notifications as Read
   
export const markAllAsRead = async ({ userId }) => {
    const result = await Notification.updateMany(
        { user: userId, isRead: false },
        { isRead: true },
    );

    return { modifiedCount: result.modifiedCount };
};

// Delete Notification
  
export const deleteNotification = async ({ notificationId, userId }) => {
    const notification = await Notification.findById(notificationId);

    if (!notification) {
        throw new ApiError("Notification not found", 404);
    }

    if (notification.user.toString() !== userId.toString()) {
        throw new ApiError("Not authorized to delete this notification", 403);
    }

    await notification.deleteOne();

    return { message: "Notification deleted successfully" };
};

//Booking Notification (internal — called by appointment service)
   

export const sendBookingNotification = async ({
    patientId,
    doctorUserId,
    appointmentDate,
    startTime,
}) => {
    const dateStr = new Date(appointmentDate).toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    await createNotification({
        userId: patientId,
        type: "booking",
        message: `Your appointment on ${dateStr} at ${startTime} has been booked successfully.`,
    });

    await createNotification({
        userId: doctorUserId,
        type: "booking",
        message: `A new appointment has been booked on ${dateStr} at ${startTime}.`,
    });
};

//Cancel Notification (internal — called by appointment service)

export const sendCancelNotification = async ({
    patientId,
    doctorUserId,
    appointmentDate,
    startTime,
    cancelledByRole,
}) => {
    const dateStr = new Date(appointmentDate).toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    const cancelledBy =
        cancelledByRole === "patient" ? "the patient" : "the doctor";

    await createNotification({
        userId: patientId,
        type: "cancel",
        message: `Your appointment on ${dateStr} at ${startTime} has been cancelled by ${cancelledBy}.`,
    });

    await createNotification({
        userId: doctorUserId,
        type: "cancel",
        message: `The appointment on ${dateStr} at ${startTime} has been cancelled by ${cancelledBy}.`,
    });
};

//Reschedule Notification (internal — called by appointment service)
   

export const sendRescheduleNotification = async ({
    patientId,
    doctorUserId,
    oldDate,
    oldStartTime,
    newDate,
    newStartTime,
}) => {
    const oldDateStr = new Date(oldDate).toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    const newDateStr = new Date(newDate).toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    await createNotification({
        userId: patientId,
        type: "reschedule",
        message: `Your appointment has been rescheduled from ${oldDateStr} at ${oldStartTime} to ${newDateStr} at ${newStartTime}.`,
    });

    await createNotification({
        userId: doctorUserId,
        type: "reschedule",
        message: `An appointment has been rescheduled from ${oldDateStr} at ${oldStartTime} to ${newDateStr} at ${newStartTime}.`,
    });
};
