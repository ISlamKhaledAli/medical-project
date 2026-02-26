import * as authService from "../services/auth.service.js";
// We will assume you build sendEmail next, but we will put placeholders for now!
import { sendEmail, emailTemplate } from "../utils/sendEmail.js";

/**
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const user = await authService.createUser(req.body);

    let verificationToken;
    try {
      verificationToken = await authService.generateVerificationToken(user._id);
    } catch (tokenError) {
      console.error("❌ Token generation failed:", tokenError.message);
      return res.status(201).json({
        success: true,
        message:
          "Account created, but verification failed. Please contact support.",
      });
    }

    const verifyUrl = `${req.protocol}://${req.get("host")}/api/auth/verifyemail/${verificationToken}`;
    const html = emailTemplate({
      title: "Verify Your Email",
      greeting: `Hi ${user.fullName || "there"} 👋`,
      body: "Thank you for creating your MediConnect account! To get started, please verify your email address by clicking the button below.",
      buttonText: "✅ Verify My Email",
      buttonUrl: verifyUrl,
      footerText:
        "⏰ This verification link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.",
    });

    try {
      await sendEmail({
        email: user.email,
        subject: "🏥 Verify Your MediConnect Email",
        message: `Verify your email: ${verifyUrl}`,
        html,
      });

      const successMsg =
        user.role === "doctor"
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
        message:
          "Registration successful, but we couldn't send the verification email. Please try logging in to resend it.",
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

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;

    const { accessToken, refreshToken: newRefreshToken } =
      await authService.handleRefreshToken(incomingRefreshToken);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    await authService.handleLogout(req.user._id);

    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");

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

    res.status(200).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Email Verified</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .card {
            background: #fff;
            border-radius: 20px;
            padding: 50px 40px;
            text-align: center;
            max-width: 450px;
            width: 90%;
            box-shadow: 0 20px 60px rgba(0,0,0,0.15);
            animation: slideUp 0.5s ease-out;
          }
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .icon {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 24px;
            animation: pop 0.6s ease-out 0.2s both;
          }
          @keyframes pop {
            0% { transform: scale(0); }
            70% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
          .icon svg {
            width: 40px;
            height: 40px;
            fill: none;
            stroke: #fff;
            stroke-width: 3;
            stroke-linecap: round;
            stroke-linejoin: round;
          }
          h1 {
            color: #1a1a2e;
            font-size: 26px;
            font-weight: 800;
            margin-bottom: 12px;
          }
          p {
            color: #6b7280;
            font-size: 15px;
            line-height: 1.6;
            margin-bottom: 30px;
          }
          .btn {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #fff;
            text-decoration: none;
            padding: 14px 40px;
            border-radius: 12px;
            font-weight: 700;
            font-size: 15px;
            transition: transform 0.2s, box-shadow 0.2s;
          }
          .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
          }
          .footer {
            margin-top: 24px;
            color: #9ca3af;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="icon">
            <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <h1>Email Verified!</h1>
          <p>Your email address has been successfully verified. You can now log in to your account and start booking appointments.</p>
          <a href="${process.env.CLIENT_URL || "http://localhost:5173"}/login" class="btn">Go to Login</a>
          <p class="footer">MediConnect &mdash; Your Health, Our Priority</p>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    const errMsg =
      error.message || "Verification failed. The link may have expired.";
    res.status(400).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Verification Failed</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .card {
            background: #fff;
            border-radius: 20px;
            padding: 50px 40px;
            text-align: center;
            max-width: 450px;
            width: 90%;
            box-shadow: 0 20px 60px rgba(0,0,0,0.15);
            animation: slideUp 0.5s ease-out;
          }
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .icon {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #f5576c 0%, #ff6b6b 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 24px;
            animation: pop 0.6s ease-out 0.2s both;
          }
          @keyframes pop {
            0% { transform: scale(0); }
            70% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
          .icon svg {
            width: 40px;
            height: 40px;
            fill: none;
            stroke: #fff;
            stroke-width: 3;
            stroke-linecap: round;
            stroke-linejoin: round;
          }
          h1 { color: #1a1a2e; font-size: 26px; font-weight: 800; margin-bottom: 12px; }
          p { color: #6b7280; font-size: 15px; line-height: 1.6; margin-bottom: 30px; }
          .error-msg { color: #ef4444; font-size: 13px; background: #fef2f2; padding: 10px 16px; border-radius: 8px; margin-bottom: 24px; }
          .btn {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #fff;
            text-decoration: none;
            padding: 14px 40px;
            border-radius: 12px;
            font-weight: 700;
            font-size: 15px;
            transition: transform 0.2s, box-shadow 0.2s;
          }
          .btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(102,126,234,0.4); }
          .footer { margin-top: 24px; color: #9ca3af; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="icon">
            <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </div>
          <h1>Verification Failed</h1>
          <p class="error-msg">${errMsg}</p>
          <p>The verification link may have expired or is invalid. Please try logging in and requesting a new verification email.</p>
          <a href="${process.env.CLIENT_URL || "http://localhost:5173"}/login" class="btn">Go to Login</a>
          <p class="footer">MediConnect &mdash; Your Health, Our Priority</p>
        </div>
      </body>
      </html>
    `);
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
      greeting: `Hi ${user.fullName || "there"} 👋`,
      body: "You requested a new verification link. Please click the button below to verify your email address.",
      buttonText: "✅ Verify My Email",
      buttonUrl: verifyUrl,
      footerText:
        "⏰ This verification link will expire in 24 hours. If you didn't request this, you can safely ignore this email.",
    });
    await sendEmail({
      email: user.email,
      subject: "🏥 Verify Your MediConnect Email",
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

    const resetUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/reset-password/${resetToken}`;
    const html = emailTemplate({
      title: "Reset Your Password",
      greeting: "Hi there 👋",
      body: "We received a request to reset the password for your MediConnect account. Click the button below to set a new password.",
      buttonText: "🔒 Reset My Password",
      buttonUrl: resetUrl,
      footerText:
        "⏰ This link will expire in 10 minutes. If you didn't request a password reset, you can safely ignore this email — your password will remain unchanged.",
    });
    await sendEmail({
      email: req.body.email,
      subject: "🔒 MediConnect Password Reset",
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
