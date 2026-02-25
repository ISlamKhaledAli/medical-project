import Appointment from "../models/Appointments.model.js";
import User from "../models/User.model.js";
import Availability from "../models/availability.model.js";
import DoctorProfile from "../models/Doctor.model.js";
import ApiError from "../utils/ApiError.js";
import { timeToMinutes, normalizeDate } from "../utils/dateTime.js";
import {
    sendBookingNotification,
    sendCancelNotification,
    sendRescheduleNotification,
} from "./notification.service.js";

//Validate Slot Availability

export const validateSlotAvailability = async ({
    doctorId,
    appointmentDate,
    startTime,
    excludeAppointmentId = null,
}) => {
    const doctorProfile = await DoctorProfile.findById(doctorId).populate("user");

    if (!doctorProfile) {
        throw new ApiError("Doctor not found", 404);
    }

    if (doctorProfile.user.status !== "approved") {
        throw new ApiError("Doctor not approved yet", 403);
    }

    if (doctorProfile.user.isBlocked) {
        throw new ApiError("Doctor is blocked", 403);
    }

    // 1. Normalize date without timezone shifting
    const normalizedDate = normalizeDate(appointmentDate);
    const dayOfWeek = normalizedDate.getDay();

    // 2. Fetch availability for the specific day
    const availability = await Availability.findOne({
        doctor: doctorId,
        dayOfWeek: dayOfWeek,
        isActive: true,
    });

    console.log("Validation Debug Info:", {
        doctorId,
        appointmentDate,
        startTime,
        excludeAppointmentId,
        normalizedDate: normalizedDate.toISOString().split("T")[0],
        calculatedDayOfWeek: dayOfWeek,
        foundAvailability: availability ? {
            dayOfWeek: availability.dayOfWeek,
            startTime: availability.startTime,
            endTime: availability.endTime,
            slotDurationMinutes: availability.slotDurationMinutes
        } : "NONE"
    });

    if (!availability) {
        throw new ApiError("NOT_WORKING_DAY: Doctor does not work on this day", 400);
    }

    const requestedStart = timeToMinutes(startTime);
    const availableStart = timeToMinutes(availability.startTime);
    const availableEnd = timeToMinutes(availability.endTime);
    const slotDuration = availability.slotDurationMinutes || 30;
    const minutesFromStart = requestedStart - availableStart;

    console.log("Alignment Debug Info:", {
        availableStart,
        availableEnd,
        requestedStart,
        minutesFromStart,
        slotDuration,
        isAligned: minutesFromStart % slotDuration === 0
    });

    // 3. Confirm time is between startTime and endTime
    if (requestedStart < availableStart || requestedStart >= availableEnd) {
        throw new ApiError("OUTSIDE_WORKING_HOURS: Selected time is outside doctor's working hours", 400);
    }

    // 4. Check alignment: (minutesFromStart % slotDuration === 0)
    if (minutesFromStart % slotDuration !== 0) {
        throw new ApiError(`SLOT_NOT_ALIGNED: Selected slot ${startTime} does not align with doctor's ${slotDuration} min schedule`, 400);
    }

    // 5. Past check (Combine Date + Time)
    const [h, m] = startTime.split(":");
    const appointmentDateTime = new Date(normalizedDate);
    appointmentDateTime.setHours(parseInt(h), parseInt(m), 0, 0);

    if (appointmentDateTime <= new Date()) {
        throw new ApiError("Cannot book past appointment", 400);
    }

    // 6. Already booked check
    const query = {
        doctor: doctorId,
        appointmentDate: normalizedDate,
        startTime,
        status: { $in: ["pending", "confirmed"] },
    };

    if (excludeAppointmentId) {
        query._id = { $ne: excludeAppointmentId };
    }

    const existingAppointment = await Appointment.findOne(query);

    if (existingAppointment) {
        throw new ApiError("This time slot is already booked", 400);
    }

    // Internal calculation of endTime for storage
    const requestedEndMinutes = requestedStart + slotDuration;
    const endH = Math.floor(requestedEndMinutes / 60).toString().padStart(2, "0");
    const endM = (requestedEndMinutes % 60).toString().padStart(2, "0");
    const endTime = `${endH}:${endM}`;

    return { endTime };
};

// Create Appointment


export const createAppointment = async ({
    doctorId,
    patientId,
    appointmentDate,
    startTime,
    currentUser,
}) => {
    if (currentUser.role !== "patient") {
        throw new ApiError("Only patients can book", 403);
    }

    const { endTime } = await validateSlotAvailability({
        doctorId,
        appointmentDate,
        startTime,
    });

    const appointment = await Appointment.create({
        doctor: doctorId,
        patient: patientId,
        appointmentDate: normalizeDate(appointmentDate),
        startTime,
        endTime,
        status: "pending",
    });

    // Fire-and-forget booking notification
    try {
        const doctorProfile = await DoctorProfile.findById(doctorId);
        if (doctorProfile) {
            await sendBookingNotification({
                patientId,
                doctorUserId: doctorProfile.user,
                appointmentDate: appointment.appointmentDate,
                startTime: appointment.startTime,
            });
        }
    } catch (err) {
        console.error("Notification failed (bookAppointment):", err.message);
    }

    return appointment;
};

//Change Status (State Machine)


export const changeAppointmentStatus = async ({
    appointmentId,
    newStatus,
    notes,
    currentUser,
}) => {
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
        throw new ApiError("Appointment not found", 404);
    }

    // Allow saving notes without changing status
    const isStatusChange = newStatus !== appointment.status;

    if (isStatusChange) {
        if (["completed", "cancelled"].includes(appointment.status)) {
            throw new ApiError("Cannot modify completed/cancelled appointment", 400);
        }

        const allowedTransitions = {
            pending: ["confirmed", "cancelled", "rejected"],
            confirmed: ["completed", "cancelled"],
        };

        if (!allowedTransitions[appointment.status]?.includes(newStatus)) {
            throw new ApiError("Invalid status transition", 400);
        }

        appointment.status = newStatus;
    }

    if (notes !== undefined) appointment.doctorNotes = notes;
    await appointment.save();

    // Return fully populated appointment so the frontend UI stays consistent
    const populated = await Appointment.findById(appointment._id)
        .populate("patient", "fullName email")
        .populate({ path: "doctor", populate: { path: "user", select: "fullName email" } });

    // Send notification to the patient
    try {
        const { createNotification } = await import("./notification.service.js");
        const doctorName = populated.doctor?.user?.fullName || "Your doctor";

        if (isStatusChange) {
            const statusMessages = {
                confirmed: `Dr. ${doctorName} has confirmed your appointment.`,
                completed: `Your appointment with Dr. ${doctorName} has been marked as completed.`,
                cancelled: `Your appointment with Dr. ${doctorName} has been cancelled.`,
                rejected: `Your appointment with Dr. ${doctorName} has been rejected.`,
            };
            const message = statusMessages[newStatus] || `Your appointment status was updated to ${newStatus}.`;
            const typeMap = { confirmed: "booking", completed: "booking", cancelled: "cancel", rejected: "cancel" };

            await createNotification({
                userId: populated.patient._id,
                type: typeMap[newStatus] || "booking",
                message,
            });
        } else if (notes !== undefined && notes.trim()) {
            await createNotification({
                userId: populated.patient._id,
                type: "booking",
                message: `Dr. ${doctorName} added notes to your appointment: "${notes.substring(0, 100)}${notes.length > 100 ? '...' : ''}"`,
            });
        }
    } catch (notifError) {
        console.error("Failed to send notification:", notifError.message);
    }

    return populated;
};

// Cancel Appointment


export const cancelAppointment = async ({
    appointmentId,
    currentUser,
}) => {
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
        throw new ApiError("Appointment not found", 404);
    }

    // Ownership check (Security)
    if (currentUser.role === "patient" && appointment.patient.toString() !== currentUser._id.toString()) {
        throw new ApiError("Not authorized to cancel this appointment", 403);
    }

    // Prevent cancelling terminal states
    if (appointment.status === "completed") {
        throw new ApiError("Cannot cancel a completed appointment", 400);
    }

    if (appointment.status === "cancelled") {
        throw new ApiError("Appointment already cancelled", 400);
    }

    // Combine date + startTime to check if already started
    const appointmentDateTime = new Date(appointment.appointmentDate);
    const [h, m] = appointment.startTime.split(":");
    appointmentDateTime.setHours(h, m, 0, 0);

    // Patient cannot cancel after appointment started
    if (currentUser.role === "patient" && appointmentDateTime <= new Date()) {
        throw new ApiError("You cannot cancel after appointment has started", 400);
    }

    // Update status to cancelled (soft delete)
    appointment.status = "cancelled";
    await appointment.save();

    // Fire-and-forget cancel notification
    try {
        const doctorProfile = await DoctorProfile.findById(appointment.doctor);
        if (doctorProfile) {
            await sendCancelNotification({
                patientId: appointment.patient,
                doctorUserId: doctorProfile.user,
                appointmentDate: appointment.appointmentDate,
                startTime: appointment.startTime,
                cancelledByRole: currentUser.role,
            });
        }
    } catch (err) {
        console.error("Notification failed (cancelAppointment):", err.message);
    }

    return appointment;
};

//Reschedule Appointment


export const rescheduleAppointment = async ({
    appointmentId,
    newDate,
    newStartTime,
    newEndTime,
    currentUser,
}) => {
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
        throw new ApiError("Appointment not found", 404);
    }

    if (["completed", "cancelled"].includes(appointment.status)) {
        throw new ApiError("Cannot reschedule completed or cancelled appointment", 400);
    }

    // Prevent rescheduling after appointment started
    const oldDateTime = new Date(appointment.appointmentDate);
    const [oldH, oldM] = appointment.startTime.split(":");
    oldDateTime.setHours(oldH, oldM, 0, 0);

    if (oldDateTime <= new Date()) {
        throw new ApiError("Cannot reschedule after appointment has started", 400);
    }

    // Ownership check (Security)
    if (currentUser.role === "patient" && appointment.patient.toString() !== currentUser._id.toString()) {
        throw new ApiError("Not authorized to reschedule this appointment", 403);
    }

    // Validate new slot
    const { endTime: calculatedEndTime } = await validateSlotAvailability({
        doctorId: appointment.doctor,
        appointmentDate: newDate,
        startTime: newStartTime,
        excludeAppointmentId: appointmentId,
    });

    // Save old values for notification before updating
    const oldDate = appointment.appointmentDate;
    const oldStartTime = appointment.startTime;

    // Update appointment
    appointment.appointmentDate = normalizeDate(newDate);
    appointment.startTime = newStartTime;
    appointment.endTime = calculatedEndTime;
    appointment.status = "pending"; // reset status

    await appointment.save();

    // Fire-and-forget reschedule notification
    try {
        const doctorProfile = await DoctorProfile.findById(appointment.doctor);
        if (doctorProfile) {
            await sendRescheduleNotification({
                patientId: appointment.patient,
                doctorUserId: doctorProfile.user,
                oldDate,
                oldStartTime,
                newDate: appointment.appointmentDate,
                newStartTime: appointment.startTime,
            });
        }
    } catch (err) {
        console.error("Notification failed (rescheduleAppointment):", err.message);
    }

    return appointment;
};


// Get My Appointments

export const getMyAppointments = async ({
    currentUser,
    queryParams,
}) => {
    let filter = {};

    if (currentUser.role === "patient") {
        filter.patient = currentUser._id;
    }

    if (currentUser.role === "doctor") {
        const doctorProfile = await DoctorProfile.findOne({
            user: currentUser._id,
        });

        if (!doctorProfile) {
            return [];
        }

        filter.doctor = doctorProfile._id;
    }

    if (queryParams.status) {
        filter.status = queryParams.status;
    }

    const appointments = await Appointment.find(filter)
        .populate({
            path: "doctor",
            populate: [
                { path: "user", select: "fullName" },
                { path: "specialty", select: "name" }
            ]
        })
        .populate("patient", "fullName email")
        .sort({ appointmentDate: 1, startTime: 1 });

    return appointments;
};


//  Get All Appointments (Admin)

export const getAllAppointments = async ({
    queryParams,
}) => {
    const {
        page = 1,
        limit = 10,
        status,
        doctor,
        patient,
        startDate,
        endDate,
    } = queryParams;

    const filter = {};

    if (status) filter.status = status;
    if (doctor) filter.doctor = doctor;
    if (patient) filter.patient = patient;

    if (startDate || endDate) {
        filter.appointmentDate = {};
        if (startDate) filter.appointmentDate.$gte = new Date(startDate);
        if (endDate) filter.appointmentDate.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;

    const appointments = await Appointment.find(filter)
        .populate({
            path: "doctor",
            populate: [
                { path: "user", select: "fullName" },
                { path: "specialty", select: "name" }
            ]
        })
        .populate("patient", "fullName email")
        .sort({ appointmentDate: -1, startTime: -1 })
        .skip(skip)
        .limit(Number(limit));

    const total = await Appointment.countDocuments(filter);

    return {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
        data: appointments,
    };
};

//Calculate Admin Stats

export const calculateAdminStats = async () => {
    const totalAppointments = await Appointment.countDocuments();
    const totalUsers = await User.countDocuments();
    const activeDoctors = await User.countDocuments({ role: "doctor", status: "approved" });
    const pendingApprovals = await User.countDocuments({ role: "doctor", status: "pending" });

    const statusStats = await Appointment.aggregate([
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 },
            },
        },
    ]);

    const monthlyAppointments = await Appointment.countDocuments({
        appointmentDate: { $gte: normalizeDate(new Date().setDate(1)) },
    });

    const revenueStats = await Appointment.aggregate([
        {
            $match: { status: "completed" },
        },
        {
            $lookup: {
                from: "doctorprofiles",
                localField: "doctor",
                foreignField: "_id",
                as: "doctorData",
            },
        },
        { $unwind: "$doctorData" },
        {
            $group: {
                _id: null,
                totalRevenue: {
                    $sum: "$doctorData.consultationFee",
                },
            },
        },
    ]);

    return {
        totalAppointments,
        totalUsers,
        activeDoctors,
        pendingApprovals,
        monthlyAppointments,
        statusStats,
        totalRevenue: revenueStats[0]?.totalRevenue || 0,
    };
};

//Get Appointment By ID


export const getAppointmentById = async ({
    appointmentId,
    currentUser,
}) => {
    const appointment = await Appointment.findById(appointmentId)
        .populate({
            path: "doctor",
            populate: [
                { path: "user", select: "fullName" },
                { path: "specialty", select: "name" }
            ]
        })
        .populate("patient", "fullName email");

    if (!appointment) {
        throw new ApiError("Appointment not found", 404);
    }

    if (currentUser.role === "admin") {
        return appointment;
    }

    if (
        currentUser.role === "patient" &&
        appointment.patient._id.toString() === currentUser._id.toString()
    ) {
        return appointment;
    }

    if (currentUser.role === "doctor") {
        const doctorProfile = await DoctorProfile.findOne({
            user: currentUser._id,
        });

        if (
            doctorProfile &&
            appointment.doctor._id.toString() === doctorProfile._id.toString()
        ) {
            return appointment;
        }
    }

    throw new ApiError("Not authorized to access this appointment", 403);
};

// Delete Appointment (Admin/System)
export const removeAppointment = async ({ appointmentId }) => {
    const appointment = await Appointment.findByIdAndDelete(appointmentId);

    if (!appointment) {
        throw new ApiError("Appointment not found", 404);
    }

    return true;
};
