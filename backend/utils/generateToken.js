import jwt from "jsonwebtoken";

export const generateAccessToken = (userId, role) => {
  const payload = { id: userId, role };

  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: "15m" });
};

export const generateRefreshToken = (userId) => {
  const payload = { id: userId };

  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
};
