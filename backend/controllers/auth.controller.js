import * as authService from "../services/auth.service.js";
// We will assume you build sendEmail next, but we will put placeholders for now!
import { sendEmail } from "../utils/sendEmail.js";

/**
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const user = await authService.createUser(req.body);

    const verificationToken = await authService.generateVerificationToken(
      user._id,
    );

    const verifyUrl = `${req.protocol}://${req.get("host")}/api/auth/verifyemail/${verificationToken}`;
    const message = `Please verify your email by clicking: \n\n ${verifyUrl}`;
    await sendEmail({ email: user.email, subject: "Verify Email", message });

    res.status(201).json({
      success: true,
      message:
        "Registration successful. Please check your email to verify your account.",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await authService.validateLogin(email, password);

    const { accessToken, refreshToken } =
      await authService.generateTokens(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict", // Prevents CSRF attacks
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      success: true,
      accessToken,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const incomingRefreshToken = req.cookies.refreshToken;

    const { accessToken, refreshToken: newRefreshToken } =
      await authService.handleRefreshToken(incomingRefreshToken);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    await authService.handleLogout(req.user._id);

    res.clearCookie("refreshToken");

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    await authService.verifyEmailToken(req.params.token);

    res.status(200).json({
      success: true,
      message: "Email verified successfully. You can now log in.",
    });
  } catch (error) {
    next(error);
  }
};

export const resendVerification = async (req, res, next) => {
  try {
    const user = await authService.validateLogin(
      req.body.email,
      req.body.password,
    );
    if (user.isVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    const verificationToken = await authService.generateVerificationToken(
      user._id,
    );

    const verifyUrl = `${req.protocol}://${req.get("host")}/api/auth/verifyemail/${verificationToken}`;
    await sendEmail({
      email: user.email,
      subject: "Verify Email",
      message: verifyUrl,
    });

    res.status(200).json({
      success: true,
      message: "A new verification email has been sent.",
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const resetToken = await authService.generateResetPasswordToken(
      req.body.email,
    );

    const resetUrl = `${req.protocol}://${req.get("host")}/api/auth/resetpassword/${resetToken}`;
    const message = `You requested a password reset. Please make a PUT request to: \n\n ${resetUrl}`;
    await sendEmail({
      email: req.body.email,
      subject: "Password Reset Token",
      message,
    });

    res.status(200).json({
      success: true,
      message: "Password reset link sent to email.",
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    await authService.handlePasswordReset(req.params.token, req.body.password);

    res.status(200).json({
      success: true,
      message:
        "Password reset successful. Please log in with your new password.",
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    next(error);
  }
};
