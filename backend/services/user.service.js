import bcrypt from "bcryptjs";
import User from "../models/User.model.js";
import ApiError from "../utils/ApiError.js";

/**
 * Get the authenticated user's own profile.
 */
export const getProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError("User not found", 404);
  return user;
};

/**
 * Update the authenticated user's profile fields.
 * Only fullName and email are allowed to be changed here.
 */
export const updateProfile = async (userId, updates) => {
  const allowedFields = ["fullName", "email"];
  const filteredUpdates = {};

  allowedFields.forEach((field) => {
    if (updates[field] !== undefined) {
      filteredUpdates[field] = updates[field];
    }
  });

  if (Object.keys(filteredUpdates).length === 0) {
    throw new ApiError(
      "No valid fields provided. You can only update fullName and email.",
      400,
    );
  }

  // If email is being changed, reset verification
  if (filteredUpdates.email) {
    filteredUpdates.isVerified = false;
  }

  const user = await User.findByIdAndUpdate(userId, filteredUpdates, {
    new: true,
    runValidators: true,
  });

  if (!user) throw new ApiError("User not found", 404);
  return user;
};

/**
 * Change the authenticated user's password.
 * Requires the current password for verification.
 */
export const changePassword = async (userId, currentPassword, newPassword) => {
  if (!currentPassword || !newPassword) {
    throw new ApiError("Please provide both current and new password.", 400);
  }

  if (currentPassword === newPassword) {
    throw new ApiError(
      "New password must be different from the current password.",
      400,
    );
  }

  // Fetch with password field (normally excluded by toJSON)
  const user = await User.findById(userId).select("+password");
  if (!user) throw new ApiError("User not found", 404);

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw new ApiError("Current password is incorrect.", 401);

  const salt = await bcrypt.genSalt(12);
  user.password = await bcrypt.hash(newPassword, salt);
  user.passwordChangedAt = new Date();
  user.refreshToken = null; // force re-login on all devices
  await user.save();
};

/**
 * Soft-delete: mark the user as blocked and clear refresh token.
 * Hard delete is intentionally avoided to preserve referential integrity.
 */
export const deleteAccount = async (userId, password) => {
  if (!password) {
    throw new ApiError(
      "Please provide your password to delete your account.",
      400,
    );
  }

  const user = await User.findById(userId).select("+password");
  if (!user) throw new ApiError("User not found", 404);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new ApiError("Password is incorrect.", 401);

  // Soft-delete: disable account
  user.isBlocked = true;
  user.refreshToken = null;
  await user.save();
};
