import { sendEmail, emailTemplate } from "../utils/sendEmail.js";
import {
  verificationSuccessTemplate,
  verificationFailureTemplate
} from "../templates/verification.template.js";

/**
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    console.log("📝 Registration started for:", req.body.email);

    const user = await authService.createUser(req.body);
    console.log("✅ User created successfully in DB:", user._id);

    let verificationToken;
    try {
      verificationToken = await authService.generateVerificationToken(user._id);
      console.log("✅ Verification token generated");
    } catch (tokenError) {
      console.error("❌ Token generation failed:", tokenError.message);
      return res.status(201).json({
        success: true,
        message: "Account created, but verification failed. Please contact support."
      });
    }

    const verifyUrl = `${req.protocol}://${req.get("host")}/api/auth/verifyemail/${verificationToken}`;
    const html = emailTemplate({
      title: "Verify Your Email",
      greeting: `Hi ${user.fullName || 'there'} 👋`,
      body: "Thank you for creating your MEDIC TOTAL account! To get started, please verify your email address by clicking the button below.",
      buttonText: "✅ Verify My Email",
      buttonUrl: verifyUrl,
      footerText: "⏰ This verification link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.",
    });

    try {
      await sendEmail({ email: user.email, subject: "🏥 Verify Your MEDIC TOTAL Email", message: `Verify your email: ${verifyUrl}`, html });
      console.log("✉️ Verification email sent successfully");

      const successMsg = user.role === "doctor"
        ? "Registration successful! Your account is pending admin approval. Please check your email for verification."
        : "Registration successful. Please check your email to verify your account.";

      res.status(201).json({
        success: true,
        message: successMsg,
      });
    } catch (emailError) {
      console.error("📧 Email sending failed:", emailError.message);
      res.status(201).json({
        success: true,
        message: "Registration successful, but we couldn't send the verification email. Please try logging in to resend it.",
      });
    }
  } catch (error) {
    console.error("💥 Registration overall failure:", error.message);
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
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

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
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    res.status(200).send(verificationSuccessTemplate(clientUrl));
  } catch (error) {
    const errMsg = error.message || "Verification failed. The link may have expired.";
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    res.status(400).send(verificationFailureTemplate(clientUrl, errMsg));
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
    const html = emailTemplate({
      title: "Verify Your Email",
      greeting: `Hi ${user.fullName || 'there'} 👋`,
      body: "You requested a new verification link. Please click the button below to verify your email address.",
      buttonText: "✅ Verify My Email",
      buttonUrl: verifyUrl,
      footerText: "⏰ This verification link will expire in 24 hours. If you didn't request this, you can safely ignore this email.",
    });
    await sendEmail({
      email: user.email,
      subject: "🏥 Verify Your MEDIC TOTAL Email",
      message: `Verify your email: ${verifyUrl}`,
      html,
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

    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
    const html = emailTemplate({
      title: "Reset Your Password",
      greeting: "Hi there 👋",
      body: "We received a request to reset the password for your MEDIC TOTAL account. Click the button below to set a new password.",
      buttonText: "🔒 Reset My Password",
      buttonUrl: resetUrl,
      footerText: "⏰ This link will expire in 10 minutes. If you didn't request a password reset, you can safely ignore this email — your password will remain unchanged.",
    });
    await sendEmail({
      email: req.body.email,
      subject: "🔒 MEDIC TOTAL Password Reset",
      message: `Reset your password: ${resetUrl}`,
      html,
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
