import Availability from "../models/availability.model.js";
import DoctorProfile from "../models/Doctor.model.js";
import Appointment from "../models/Appointments.model.js";
import ApiError from "../utils/ApiError.js";
import { timeToMinutes, normalizeDate } from "../utils/dateTime.js";

/* =========================
   Validate Availability Input
========================= */
export const validateAvailability = ({
    startTime,
    endTime,
    slotDurationMinutes,
}) => {
    const start = timeToMinutes(startTime);
    const end = timeToMinutes(endTime);

    if (start >= end) {
        throw new ApiError("End time must be after start time", 400);
    }

    if ((end - start) % (slotDurationMinutes || 30) !== 0) {
        throw new ApiError(
            "Time range must align with slot duration",
            400
        );
    }
};

/* =========================
   Set Weekly Availability
========================= */
export const setWeeklyAvailability = async ({
    availability,
    currentUser,
}) => {
    const doctorProfile = await DoctorProfile.findOne({
        user: currentUser._id,
    });

    if (!doctorProfile) {
        throw new ApiError("Doctor profile not found.", 404);
    }

    if (currentUser.status !== "approved") {
        throw new ApiError("Account pending approval.", 403);
    }

    // Validate each active day
    availability.forEach(day => {
        if (day.isActive) {
            if (!day.startTime || !day.endTime) {
                throw new ApiError(`Missing times for day ${day.dayOfWeek}`, 400);
            }
            validateAvailability({
                startTime: day.startTime,
                endTime: day.endTime,
                slotDurationMinutes: day.slotDurationMinutes || day.slotDuration || 30
            });
        }
    });

    const doctorId = doctorProfile._id;

    const operations = availability.map(day => ({
        updateOne: {
            filter: { doctor: doctorId, dayOfWeek: day.dayOfWeek },
            update: {
                $set: {
                    startTime: day.startTime,
                    endTime: day.endTime,
                    slotDurationMinutes: day.slotDurationMinutes || day.slotDuration || 30,
                    isActive: day.isActive
                }
            },
            upsert: true
        }
    }));

    await Availability.bulkWrite(operations);

    return { message: "Schedule updated successfully" };
};

/* =========================
   Update Availability (Legacy/Single)
========================= */
export const updateAvailability = async ({
    availabilityId,
    startTime,
    endTime,
    slotDuration,
    currentUser,
}) => {
    const availability = await Availability.findById(availabilityId);
    if (!availability) throw new ApiError("Availability not found", 404);

    const doctorProfile = await DoctorProfile.findOne({ user: currentUser._id });
    if (!doctorProfile || availability.doctor.toString() !== doctorProfile._id.toString()) {
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
   Delete Availability (Toggles isActive instead)
========================= */
export const deleteAvailability = async ({
    availabilityId,
    currentUser,
}) => {
    const availability = await Availability.findById(availabilityId);
    if (!availability) throw new ApiError("Availability not found", 404);

    const doctorProfile = await DoctorProfile.findOne({ user: currentUser._id });
    if (!doctorProfile || availability.doctor.toString() !== doctorProfile._id.toString()) {
        throw new ApiError("Not authorized", 403);
    }

    availability.isActive = false;
    await availability.save();

    return { message: "Availability deactivated" };
};

/* =========================
   Generate Time Slots
========================= */
export const generateTimeSlots = (availability) => {
    const slots = [];
    if (!availability.startTime || !availability.endTime) return slots;

    const start = timeToMinutes(availability.startTime);
    const end = timeToMinutes(availability.endTime);
    const duration = availability.slotDurationMinutes || availability.slotDuration || 30;

    for (let time = start; time < end; time += duration) {
        const hours = Math.floor(time / 60).toString().padStart(2, "0");
        const minutes = (time % 60).toString().padStart(2, "0");

        const startTime = `${hours}:${minutes}`;
        const endTimeMinutes = time + duration;
        const endHours = Math.floor(endTimeMinutes / 60).toString().padStart(2, "0");
        const endMinutes = (endTimeMinutes % 60).toString().padStart(2, "0");
        const endTime = `${endHours}:${endMinutes}`;

        slots.push({
            startTime,
            endTime
        });
    }
    return slots;
};

export const getDoctorAvailability = async (doctorId, dateString) => {
    // 1. Get ALL ranges for the doctor to determine working days
    const allRanges = await Availability.find({ doctor: doctorId, isActive: true });
    const workingDays = allRanges.map(r => r.dayOfWeek);

    // 2. If no date provided, return working days AND the raw records for management
    if (!dateString) {
        return { workingDays, availabilityList: allRanges };
    }

    // 3. Filter ranges by specific date
    const date = normalizeDate(dateString);
    const dayIndex = date.getDay();

    const range = allRanges.find(r => r.dayOfWeek === dayIndex);

    if (!range) {
        return { workingDays, slots: [] };
    }

    // 4. Get active bookings
    const startOfTargetDay = normalizeDate(dateString);
    const endOfTargetDay = new Date(startOfTargetDay);
    endOfTargetDay.setHours(23, 59, 59, 999);

    const existingAppointments = await Appointment.find({
        doctor: doctorId,
        appointmentDate: { $gte: startOfTargetDay, $lte: endOfTargetDay },
        status: { $in: ["pending", "confirmed"] }
    });

    // 5. Generate slots
    const slots = generateTimeSlots(range);
    const slotsWithStatus = slots.map(slot => ({
        ...slot,
        isAvailable: !existingAppointments.some(apt => apt.startTime === slot.startTime)
    }));

    return { workingDays, slots: slotsWithStatus };
};
