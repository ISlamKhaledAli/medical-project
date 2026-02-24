import User from "../models/User.model.js";
import DoctorProfile from "../models/Doctor.model.js";
import Appointment from "../models/Appointments.model.js";
import Availability from "../models/availability.model.js";
import Notification from "../models/Notifications.model.js";
import ApiError from "../utils/ApiError.js";
import { createNotification } from "./notification.service.js";
import { disconnectUser } from "../sockets/socket.js";


//Get All Users (paginated + filters)

export const getAllUsers = async ({ queryParams }) => {
    const {
        page = 1,
        limit = 10,
        role,
        isBlocked,
        isApproved,
        search,
    } = queryParams;

    const filter = {};

    if (role) filter.role = role;
    if (isBlocked !== undefined) filter.isBlocked = isBlocked === "true";
    if (isApproved !== undefined) filter.isApproved = isApproved === "true";

    if (search) {
        filter.$or = [
            { fullName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
        ];
    }

    const skip = (page - 1) * limit;

    const users = await User.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

    const total = await User.countDocuments(filter);

    return {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
        data: users,
    };
};

//Get User By ID

export const getUserById = async ({ userId }) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError("User not found", 404);
    }

    // If user is a doctor, include their profile
    let doctorProfile = null;
    if (user.role === "doctor") {
        doctorProfile = await DoctorProfile.findOne({ user: userId }).populate(
            "specialty",
        );
    }

    return {
        user,
        doctorProfile,
    };
};

//Approve Doctor

export const approveDoctor = async ({ userId, currentUserId }) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError("User not found", 404);
    }

    if (user.role !== "doctor") {
        throw new ApiError("This user is not a doctor", 400);
    }

    if (user.isApproved) {
        throw new ApiError("Doctor is already approved", 400);
    }

    user.isApproved = true;
    await user.save();

    // Fire-and-forget notification
    try {
        await createNotification({
            userId: user._id,
            type: "booking",
            message:
                "Your doctor account has been approved. You can now receive appointments.",
        });
    } catch (err) {
        console.error("Notification failed (approveDoctor):", err.message);
    }

    return user;
};

//Block User

export const blockUser = async ({ userId, currentUserId }) => {
    if (userId === currentUserId.toString()) {
        throw new ApiError("You cannot block your own account", 400);
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError("User not found", 404);
    }

    if (user.role === "admin") {
        throw new ApiError("Cannot block an admin account", 400);
    }

    if (user.isBlocked) {
        throw new ApiError("User is already blocked", 400);
    }

    // Cancel future active appointments for this user
    await cancelUserActiveAppointments({ user });

    // Block user and invalidate refresh token
    user.isBlocked = true;
    user.refreshToken = null;
    await user.save();

    // Fire-and-forget notification
    try {
        await createNotification({
            userId: user._id,
            type: "cancel",
            message:
                "Your account has been blocked by an administrator. Please contact support.",
        });
    } catch (err) {
        console.error("Notification failed (blockUser):", err.message);
    }

    // Force-disconnect all active sockets for this user
    disconnectUser(userId);

    return user;
};

//Unblock User
export const unblockUser = async ({ userId }) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError("User not found", 404);
    }

    if (!user.isBlocked) {
        throw new ApiError("User is not blocked", 400);
    }

    user.isBlocked = false;
    await user.save();

    // Fire-and-forget notification
    try {
        await createNotification({
            userId: user._id,
            type: "booking",
            message:
                "Your account has been unblocked. You can now access the platform.",
        });
    } catch (err) {
        console.error("Notification failed (unblockUser):", err.message);
    }

    return user;
};

//Delete User


export const deleteUser = async ({ userId, currentUserId }) => {
    if (userId === currentUserId.toString()) {
        throw new ApiError("You cannot delete your own account", 400);
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError("User not found", 404);
    }

    if (user.role === "admin") {
        throw new ApiError("Cannot delete an admin account", 400);
    }

    // Cancel future active appointments
    await cancelUserActiveAppointments({ user });

    // If doctor, remove doctor profile and availability
    if (user.role === "doctor") {
        const doctorProfile = await DoctorProfile.findOne({ user: userId });

        if (doctorProfile) {
            await Availability.deleteMany({ doctor: doctorProfile._id });
            await doctorProfile.deleteOne();
        }
    }

    // Remove user's notifications
    await Notification.deleteMany({ user: userId });

    // Delete the user
    await user.deleteOne();

    return { message: "User deleted successfully" };
};

//Update User Role

export const updateUserRole = async ({ userId, newRole, currentUserId }) => {
    if (userId === currentUserId.toString()) {
        throw new ApiError("You cannot change your own role", 400);
    }

    const validRoles = ["admin", "doctor", "patient"];
    if (!validRoles.includes(newRole)) {
        throw new ApiError(
            `Invalid role. Must be one of: ${validRoles.join(", ")}`,
            400,
        );
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError("User not found", 404);
    }

    const oldRole = user.role;

    if (oldRole === newRole) {
        throw new ApiError(`User already has role: ${newRole}`, 400);
    }

    // If changing from doctor to another role, clean up doctor data
    if (oldRole === "doctor" && newRole !== "doctor") {
        const doctorProfile = await DoctorProfile.findOne({ user: userId });

        if (doctorProfile) {
            // Cancel future appointments for this doctor
            await Appointment.updateMany(
                {
                    doctor: doctorProfile._id,
                    status: { $in: ["pending", "confirmed"] },
                    appointmentDate: { $gte: new Date() },
                },
                { status: "cancelled" },
            );

            await Availability.deleteMany({ doctor: doctorProfile._id });
            await doctorProfile.deleteOne();
        }
    }

    user.role = newRole;

    // Auto-approve patients and admins, require approval for new doctors
    if (newRole === "patient" || newRole === "admin") {
        user.isApproved = true;
    } else if (newRole === "doctor") {
        user.isApproved = false;
    }

    await user.save();

    return user;
};


//Helper: Cancel Active Appointments for a User
   

const cancelUserActiveAppointments = async ({ user }) => {
    const activeStatuses = { $in: ["pending", "confirmed"] };
    const futureDate = { $gte: new Date() };

    if (user.role === "patient") {
        await Appointment.updateMany(
            {
                patient: user._id,
                status: activeStatuses,
                appointmentDate: futureDate,
            },
            { status: "cancelled" },
        );
    }

    if (user.role === "doctor") {
        const doctorProfile = await DoctorProfile.findOne({ user: user._id });

        if (doctorProfile) {
            // Get affected appointments to notify patients
            const affectedAppointments = await Appointment.find({
                doctor: doctorProfile._id,
                status: activeStatuses,
                appointmentDate: futureDate,
            });

            // Cancel all
            await Appointment.updateMany(
                {
                    doctor: doctorProfile._id,
                    status: activeStatuses,
                    appointmentDate: futureDate,
                },
                { status: "cancelled" },
            );

            // Notify affected patients (fire-and-forget)
            for (const apt of affectedAppointments) {
                try {
                    await createNotification({
                        userId: apt.patient,
                        type: "cancel",
                        message: `Your appointment on ${new Date(apt.appointmentDate).toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" })} at ${apt.startTime} has been cancelled due to doctor account changes.`,
                    });
                } catch (err) {
                    console.error(
                        "Notification failed (cancelUserActiveAppointments):",
                        err.message,
                    );
                }
            }
        }
    }
};
