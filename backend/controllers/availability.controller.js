import wrapAsync from "../middleware/asyncHandler.js";
import {
    createAvailability,
    updateAvailability,
    deleteAvailability,
    getDoctorAvailability,
} from "../services/availability.service.js";

export const setAvailability = wrapAsync(async (req, res) => {
    const availability = await createAvailability({
        ...req.body,
        currentUser: req.user,
    });

    res.status(201).json({
        success: true,
        data: availability,
    });
});

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
    const availability = await getDoctorAvailability(req.params.doctorId);

    res.json({
        success: true,
        data: availability,
    });
});
