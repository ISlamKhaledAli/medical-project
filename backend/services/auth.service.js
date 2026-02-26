import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";
import { disconnectUser } from "../sockets/socket.js";

import ApiError from "../utils/ApiError.js";

export const createUser = async (userData) => {
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(userData.password, salt);

  const user = await User.create({
    ...userData,
    password: hashedPassword,
    status: userData.role?.toLowerCase() === "doctor" ? "pending" : "approved",
  });

  return user;
};

export const validateLogin = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new ApiError("Invalid email or password", 401);

  if (user.isBlocked) {
    throw new ApiError("Your account has been blocked by an administrator.", 403);
  }

  if (user.status !== "approved") {
    throw new ApiError(
      user.status === "pending"
        ? "Your account is pending admin approval."
        : "Your account has been rejected. Please contact support.",
      403
    );
  }

  if (!user.isVerified) {
    throw new ApiError("Please verify your email address before logging in.", 403);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new ApiError("Invalid email or password", 401);

  return user;
};

export const generateTokens = async (user) => {
  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  return { accessToken, refreshToken };
};

export const handleRefreshToken = async (incomingRefreshToken) => {
  if (!incomingRefreshToken) throw new ApiError("No refresh token provided", 401);

  const user = await User.findOne({ refreshToken: incomingRefreshToken });

  if (!user) {
    throw new ApiError("Invalid refresh token. Please log in again.", 401);
  }

  if (user.isBlocked) {
    user.refreshToken = null;
    await user.save();
    throw new ApiError("Your account has been blocked by an administrator.", 403);
  }

  const accessToken = generateAccessToken(user._id, user.role);
  const newRefreshToken = generateRefreshToken(user._id);

  user.refreshToken = newRefreshToken;
  await user.save();

  return { accessToken, refreshToken: newRefreshToken };
};

export const handleLogout = async (userId) => {
  await User.findByIdAndUpdate(userId, { refreshToken: null });

  // Disconnect all active sockets for this user
  disconnectUser(userId.toString());
};

export const generateVerificationToken = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError("User not found", 404);

  const verificationToken = crypto.randomBytes(32).toString("hex");

  user.verificationToken = verificationToken;
  user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;
  await user.save();

  return verificationToken;
};

export const verifyEmailToken = async (token) => {
  const user = await User.findOne({
    verificationToken: token,
    verificationTokenExpires: { $gt: Date.now() },
  });

  if (!user) throw new ApiError("Invalid or expired verification token", 400);

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;
  await user.save();

  return user;
};

export const generateResetPasswordToken = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new ApiError("No user found with that email", 404);

  const resetToken = crypto.randomBytes(32).toString("hex");

  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
  await user.save();

  return resetToken;
};

export const handlePasswordReset = async (token, newPassword) => {
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) throw new ApiError("Invalid or expired password reset token", 400);

  const salt = await bcrypt.genSalt(12);
  user.password = await bcrypt.hash(newPassword, salt);

  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  user.refreshToken = null;
  user.passwordChangedAt = Date.now();

  await user.save();
  return user;
};
