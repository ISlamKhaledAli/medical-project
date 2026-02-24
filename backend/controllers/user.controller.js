import * as userService from "../services/user.service.js";
import wrapAsync from "../middleware/asyncHandler.js";

/**
 * @route   GET /api/users/profile
 * @access  Private
 * @desc    Get the logged-in user's profile
 */
export const getProfile = wrapAsync(async (req, res) => {
  const user = await userService.getProfile(req.user._id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * @route   PATCH /api/users/profile
 * @access  Private
 * @desc    Update fullName or email
 */
export const updateProfile = wrapAsync(async (req, res) => {
  const user = await userService.updateProfile(req.user._id, req.body);

  res.status(200).json({
    success: true,
    message: "Profile updated successfully.",
    data: user,
  });
});

/**
 * @route   PATCH /api/users/change-password
 * @access  Private
 * @desc    Change password (requires current password)
 */
export const changePassword = wrapAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  await userService.changePassword(req.user._id, currentPassword, newPassword);

  res.status(200).json({
    success: true,
    message:
      "Password changed successfully. Please log in again on all devices.",
  });
});

/**
 * @route   DELETE /api/users/profile
 * @access  Private
 * @desc    Soft-delete the user's own account (requires password confirmation)
 */
export const deleteAccount = wrapAsync(async (req, res) => {
  const { password } = req.body;

  await userService.deleteAccount(req.user._id, password);

  // Clear refresh token cookie on account deletion
  res.clearCookie("refreshToken");

  res.status(200).json({
    success: true,
    message: "Your account has been deactivated successfully.",
  });
});
