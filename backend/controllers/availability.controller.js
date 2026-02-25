import wrapAsync from "../middleware/asyncHandler.js";
import {
    setWeeklyAvailability,
    updateAvailability,
    deleteAvailability,
    getDoctorAvailability,
} from "../services/availability.service.js";

export const setAvailability = async (req, res) => {
    try {
        const { availability } = req.body;

        if (!availability || !Array.isArray(availability)) {
            return res.status(400).json({
                success: false,
                message: "availability must be an array"
            });
        }

        // Basic validation for active days
        for (const day of availability) {
            if (day.isActive && (!day.startTime || !day.endTime)) {
                return res.status(400).json({
                    success: false,
                    message: `Missing startTime or endTime for day ${day.dayOfWeek}`
                });
            }
        }

        const result = await setWeeklyAvailability({
            availability,
            currentUser: req.user,
        });

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error("Availability save error:", error.message, error.stack);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to save availability"
        });
    }
};

export const updateAvailabilityHandler = wrapAsync(async (req, res) => {
    const availability = await updateAvailability({
        availabilityId: req.params.id,
        ...req.body,
        currentUser: req.user,
    });

    res.json({
        success: true,
        data: availability,
    });
});

export const deleteAvailabilityHandler = wrapAsync(async (req, res) => {
    const result = await deleteAvailability({
        availabilityId: req.params.id,
        currentUser: req.user,
    });

    res.json({
        success: true,
        data: result,
    });
});

export const getDoctorAvailabilityHandler = wrapAsync(async (req, res) => {
    console.log("Fetching availability:", { doctorId: req.params.doctorId, date: req.query.date });
    const availability = await getDoctorAvailability(req.params.doctorId, req.query.date);

    res.json({
        success: true,
        data: availability,
    });
});
