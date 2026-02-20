import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";

export const createUser = async (userData) => {
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(userData.password, salt);

  const user = await User.create({
    ...userData,
    password: hashedPassword,
  });

  return user;
};

export const validateLogin = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid email or password");

  if (user.isBlocked) {
    throw new Error("Your account has been blocked by an administrator.");
  }

  if (!user.isApproved) {
    throw new Error("Your account is pending admin approval.");
  }

  if (!user.isVerified) {
    throw new Error("Please verify your email address before logging in.");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid email or password");

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
  if (!incomingRefreshToken) throw new Error("No refresh token provided");

  const user = await User.findOne({ refreshToken: incomingRefreshToken });

  if (!user) {
    throw new Error("Invalid refresh token. Please log in again.");
  }

  const accessToken = generateAccessToken(user._id, user.role);
  const newRefreshToken = generateRefreshToken(user._id);

  user.refreshToken = newRefreshToken;
  await user.save();

  return { accessToken, refreshToken: newRefreshToken };
};

export const handleLogout = async (userId) => {
  await User.findByIdAndUpdate(userId, { refreshToken: null });
};

export const generateVerificationToken = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

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

  if (!user) throw new Error("Invalid or expired verification token");

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;
  await user.save();

  return user;
};

export const generateResetPasswordToken = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("No user found with that email");

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

  if (!user) throw new Error("Invalid or expired password reset token");

  const salt = await bcrypt.genSalt(12);
  user.password = await bcrypt.hash(newPassword, salt);

  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  user.refreshToken = null;
  user.passwordChangedAt = Date.now();

  await user.save();
  return user;
};
