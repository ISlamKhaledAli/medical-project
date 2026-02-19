import Availability from "../models/availability.model.js";
import DoctorProfile from "../models/Doctor.model.js";
import ApiError from "../utils/ApiError.js";
import { timeToMinutes } from "../utils/dateTime.js";

/* =========================
   Validate Availability Input
========================= */
export const validateAvailability = ({
    startTime,
    endTime,
    slotDuration,
}) => {
    const start = timeToMinutes(startTime);
    const end = timeToMinutes(endTime);

    if (start >= end) {
        throw new ApiError("End time must be after start time", 400);
    }

    if ((end - start) % slotDuration !== 0) {
        throw new ApiError(
            "Time range must align with slot duration",
            400
        );
    }
};

/* =========================
   Create Availability
========================= */
export const createAvailability = async ({
    dayOfWeek,
    startTime,
    endTime,
    slotDuration,
    currentUser,
}) => {
    if (currentUser.role !== "doctor") {
        throw new ApiError("Only doctors can set availability", 403);
    }

    const doctorProfile = await DoctorProfile.findOne({
        user: currentUser._id,
    });

    if (!doctorProfile) {
        throw new ApiError("Doctor profile not found", 404);
    }

    validateAvailability({ startTime, endTime, slotDuration });

    // Prevent duplicate availability for same day
    const existing = await Availability.findOne({
        doctor: doctorProfile._id,
        dayOfWeek,
    });

    if (existing) {
        throw new ApiError(
            "Availability already exists for this day",
            400
        );
    }

    const availability = await Availability.create({
        doctor: doctorProfile._id,
        dayOfWeek,
        startTime,
        endTime,
        slotDuration,
    });

    return availability;
};

/* =========================
   Update Availability
========================= */
export const updateAvailability = async ({
    availabilityId,
    startTime,
    endTime,
    slotDuration,
    currentUser,
}) => {
    const availability = await Availability.findById(availabilityId);

    if (!availability) {
        throw new ApiError("Availability not found", 404);
    }

    const doctorProfile = await DoctorProfile.findOne({
        user: currentUser._id,
    });

    if (
        !doctorProfile ||
        availability.doctor.toString() !== doctorProfile._id.toString()
    ) {
        throw new ApiError("Not authorized", 403);
    }

    validateAvailability({ startTime, endTime, slotDuration });

    availability.startTime = startTime;
    availability.endTime = endTime;
    availability.slotDuration = slotDuration;

    await availability.save();

    return availability;
};

/* =========================
   Delete Availability
========================= */
export const deleteAvailability = async ({
    availabilityId,
    currentUser,
}) => {
    const availability = await Availability.findById(availabilityId);

    if (!availability) {
        throw new ApiError("Availability not found", 404);
    }

    const doctorProfile = await DoctorProfile.findOne({
        user: currentUser._id,
    });

    if (
        !doctorProfile ||
        availability.doctor.toString() !== doctorProfile._id.toString()
    ) {
        throw new ApiError("Not authorized", 403);
    }

    await availability.deleteOne();

    return { message: "Availability deleted successfully" };
};

/* =========================
   Generate Time Slots
========================= */
export const generateTimeSlots = (availability) => {
    const slots = [];

    const start = timeToMinutes(availability.startTime);
    const end = timeToMinutes(availability.endTime);

    for (
        let time = start;
        time < end;
        time += availability.slotDuration
    ) {
        const hours = Math.floor(time / 60)
            .toString()
            .padStart(2, "0");
        const minutes = (time % 60)
            .toString()
            .padStart(2, "0");

        const nextTime = time + availability.slotDuration;
        const nextHours = Math.floor(nextTime / 60)
            .toString()
            .padStart(2, "0");
        const nextMinutes = (nextTime % 60)
            .toString()
            .padStart(2, "0");

        slots.push({
            startTime: `${hours}:${minutes}`,
            endTime: `${nextHours}:${nextMinutes}`,
        });
    }

    return slots;
};

/* =========================
   Get Doctor Availability
========================= */
export const getDoctorAvailability = async (doctorId) => {
    const availability = await Availability.find({
        doctor: doctorId,
    });

    return availability;
};
