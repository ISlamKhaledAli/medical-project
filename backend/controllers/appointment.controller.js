import {
    createAppointment,
    changeAppointmentStatus,
    cancelAppointment,
    rescheduleAppointment,
    getMyAppointments,
    getAllAppointments,
    calculateAdminStats,
    getAppointmentById,
    removeAppointment,
} from "../services/appointment.service.js";
import wrapAsync from "../middleware/asyncHandler.js";
import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";

export const bookAppointment = wrapAsync(async (req, res) => {
    console.log("Incoming booking payload:", req.body);
    const appointment = await createAppointment({
        doctorId: req.body.doctorId,
        patientId: req.user._id,
        appointmentDate: req.body.appointmentDate,
        startTime: req.body.startTime,
        currentUser: req.user,
    });

    res.status(201).json({
        success: true,
        data: appointment,
    });
});

export const updateAppointmentStatus = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const { status, notes: doctorNotes } = req.body;

    // 1. Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError("Invalid appointment ID format", 400);
    }

    // 2. Validate Status exists
    if (!status) {
        throw new ApiError("Status is required", 400);
    }

    // 3. Map "approved" to "confirmed" if coming from frontend
    const finalStatus = status === "approved" ? "confirmed" : status;

    // 4. Validate allowed values (sync with Mongoose enum)
    const validStatuses = ["pending", "confirmed", "completed", "cancelled"];
    if (!validStatuses.includes(finalStatus)) {
        throw new ApiError(`Invalid status. Must be one of: ${validStatuses.join(", ")}`, 400);
    }

    const appointment = await changeAppointmentStatus({
        appointmentId: id,
        newStatus: finalStatus,
        notes: doctorNotes,
        currentUser: req.user,
    });

    res.json({
        success: true,
        data: appointment,
    });
});

export const cancelAppointmentHandler = wrapAsync(async (req, res) => {
    const appointment = await cancelAppointment({
        appointmentId: req.params.id,
        currentUser: req.user,
    });

    res.json({
        success: true,
        data: appointment,
    });
});

export const rescheduleAppointmentHandler = wrapAsync(async (req, res) => {
    console.log("Incoming reschedule payload:", req.body);
    const appointment = await rescheduleAppointment({
        appointmentId: req.params.id,
        newDate: req.body.appointmentDate,
        newStartTime: req.body.startTime,
        currentUser: req.user,
    });

    res.json({
        success: true,
        data: appointment,
    });
});

export const getMyAppointmentsHandler = wrapAsync(async (req, res) => {
    const appointments = await getMyAppointments({
        currentUser: req.user,
        queryParams: req.query,
    });

    res.json({
        success: true,
        count: appointments.length,
        data: appointments,
    });
});

export const getAllAppointmentsHandler = wrapAsync(async (req, res) => {
    const result = await getAllAppointments({
        queryParams: req.query,
    });

    res.json({
        success: true,
        ...result,
    });
});

export const getAppointmentStatsHandler = wrapAsync(async (req, res) => {
    const stats = await calculateAdminStats();

    res.json({
        success: true,
        data: stats,
    });
});

export const getAppointmentByIdHandler = wrapAsync(async (req, res) => {
    const appointment = await getAppointmentById({
        appointmentId: req.params.id,
        currentUser: req.user,
    });

    res.json({
        success: true,
        data: appointment,
    });
});

export const deleteAppointmentHandler = wrapAsync(async (req, res) => {
    const { id } = req.params;

    // 1. Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError("Invalid appointment ID format", 400);
    }

    // 2. Call service to remove
    await removeAppointment({ appointmentId: id });

    res.status(200).json({
        success: true,
        message: "Appointment deleted successfully",
    });
});
