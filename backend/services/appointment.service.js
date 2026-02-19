import Appointment from "../models/Appointments.model.js";
import Availability from "../models/availability.model.js";
import DoctorProfile from "../models/Doctor.model.js";
import ApiError from "../utils/ApiError.js";
import { timeToMinutes, normalizeDate } from "../utils/dateTime.js";

/* =========================
   Validate Slot Availability
========================= */
export const validateSlotAvailability = async ({
    doctorId,
    appointmentDate,
    startTime,
    endTime,
}) => {
    const doctorProfile = await DoctorProfile.findById(doctorId).populate("user");

    if (!doctorProfile) {
        throw new ApiError("Doctor not found", 404);
    }

    if (!doctorProfile.user.isApproved) {
        throw new ApiError("Doctor not approved yet", 403);
    }

    if (doctorProfile.user.isBlocked) {
        throw new ApiError("Doctor is blocked", 403);
    }

    // Future check
    const appointmentDateTime = new Date(appointmentDate);
    const [h, m] = startTime.split(":");
    appointmentDateTime.setHours(h, m, 0, 0);

    if (appointmentDateTime <= new Date()) {
        throw new ApiError("Cannot book past appointment", 400);
    }

    // Day check
    const day = new Date(appointmentDate).getDay();

    const availability = await Availability.findOne({
        doctor: doctorId,
        dayOfWeek: day,
    });

    if (!availability) {
        throw new ApiError("Doctor not available on this day", 400);
    }

    const requestedStart = timeToMinutes(startTime);
    const requestedEnd = timeToMinutes(endTime);
    const availableStart = timeToMinutes(availability.startTime);
    const availableEnd = timeToMinutes(availability.endTime);

    if (requestedStart < availableStart || requestedEnd > availableEnd) {
        throw new ApiError("Requested time outside availability", 400);
    }

    if (requestedEnd - requestedStart !== availability.slotDuration) {
        throw new ApiError("Invalid slot duration", 400);
    }

    if ((requestedStart - availableStart) % availability.slotDuration !== 0) {
        throw new ApiError("Slot not aligned with schedule", 400);
    }

    const existingAppointment = await Appointment.findOne({
        doctor: doctorId,
        appointmentDate,
        startTime,
        status: { $ne: "cancelled" },
    });

    if (existingAppointment) {
        throw new ApiError("Slot already booked", 400);
    }

    return true;
};

/* =========================
   Create Appointment
========================= */
export const createAppointment = async ({
    doctorId,
    patientId,
    appointmentDate,
    startTime,
    endTime,
    currentUser,
}) => {
    if (currentUser.role !== "patient") {
        throw new ApiError("Only patients can book", 403);
    }

    await validateSlotAvailability({
        doctorId,
        appointmentDate,
        startTime,
        endTime,
    });

    const appointment = await Appointment.create({
        doctor: doctorId,
        patient: patientId,
        appointmentDate: normalizeDate(appointmentDate),
        startTime,
        endTime,
        status: "pending",
    });

    return appointment;
};

/* =========================
   Change Status (State Machine)
========================= */
export const changeAppointmentStatus = async ({
    appointmentId,
    newStatus,
    currentUser,
}) => {
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
        throw new ApiError("Appointment not found", 404);
    }

    if (["completed", "cancelled"].includes(appointment.status)) {
        throw new ApiError("Cannot modify completed/cancelled appointment", 400);
    }

    const allowedTransitions = {
        pending: ["confirmed", "cancelled"],
        confirmed: ["completed", "cancelled"],
    };

    if (!allowedTransitions[appointment.status]?.includes(newStatus)) {
        throw new ApiError("Invalid status transition", 400);
    }

    appointment.status = newStatus;
    await appointment.save();

    return appointment;
};

/* =========================
   Cancel Appointment
========================= */
export const cancelAppointment = async ({
    appointmentId,
    currentUser,
}) => {
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
        throw new ApiError("Appointment not found", 404);
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

    return appointment;
};

/* =========================
   Reschedule Appointment
========================= */
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

    // Validate new slot
    await validateSlotAvailability({
        doctorId: appointment.doctor,
        appointmentDate: newDate,
        startTime: newStartTime,
        endTime: newEndTime,
    });

    // Update appointment
    appointment.appointmentDate = normalizeDate(newDate);
    appointment.startTime = newStartTime;
    appointment.endTime = newEndTime;
    appointment.status = "pending"; // reset status

    await appointment.save();

    return appointment;
};

/* =========================
   Get My Appointments
========================= */
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
            throw new ApiError("Doctor profile not found", 404);
        }

        filter.doctor = doctorProfile._id;
    }

    if (queryParams.status) {
        filter.status = queryParams.status;
    }

    const appointments = await Appointment.find(filter)
        .populate("doctor")
        .populate("patient", "name email")
        .sort({ appointmentDate: 1, startTime: 1 });

    return appointments;
};

/* =========================
   Get All Appointments (Admin)
========================= */
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
        .populate("doctor")
        .populate("patient", "name email")
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

/* =========================
   Calculate Admin Stats
========================= */
export const calculateAdminStats = async () => {
    const totalAppointments = await Appointment.countDocuments();

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
        monthlyAppointments,
        statusStats,
        totalRevenue: revenueStats[0]?.totalRevenue || 0,
    };
};

/* =========================
   Get Appointment By ID
========================= */
export const getAppointmentById = async ({
    appointmentId,
    currentUser,
}) => {
    const appointment = await Appointment.findById(appointmentId)
        .populate("doctor")
        .populate("patient", "name email");

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
