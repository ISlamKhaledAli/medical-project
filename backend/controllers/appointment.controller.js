import {
    createAppointment,
    changeAppointmentStatus,
    cancelAppointment,
    rescheduleAppointment,
    getMyAppointments,
    getAllAppointments,
    calculateAdminStats,
    getAppointmentById,
} from "../services/appointment.service.js";
import wrapAsync from "../middleware/asyncHandler.js";

export const bookAppointment = wrapAsync(async (req, res) => {
    const appointment = await createAppointment({
        doctorId: req.body.doctorId,
        patientId: req.user._id,
        appointmentDate: req.body.appointmentDate,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        currentUser: req.user,
    });

    res.status(201).json({
        success: true,
        data: appointment,
    });
});

export const updateAppointmentStatus = wrapAsync(async (req, res) => {
    const appointment = await changeAppointmentStatus({
        appointmentId: req.params.id,
        newStatus: req.body.status,
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
    const appointment = await rescheduleAppointment({
        appointmentId: req.params.id,
        newDate: req.body.appointmentDate,
        newStartTime: req.body.startTime,
        newEndTime: req.body.endTime,
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
