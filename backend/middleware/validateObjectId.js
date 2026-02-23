import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";

/**
 * Middleware factory that validates a route parameter as a valid MongoDB ObjectId.
 * @param {string} paramName - The name of the route parameter to validate (default: "id").
 * @returns {Function} Express middleware
 *
 * Usage:
 *   router.get("/:id", validateObjectId("id"), handler);
 *   router.get("/:userId", validateObjectId("userId"), handler);
 */
const validateObjectId = (paramName = "id") => {
    return (req, res, next) => {
        if (!mongoose.Types.ObjectId.isValid(req.params[paramName])) {
            throw new ApiError(
                `Invalid ID: ${req.params[paramName]}`,
                400,
            );
        }
        next();
    };
};

export default validateObjectId;
