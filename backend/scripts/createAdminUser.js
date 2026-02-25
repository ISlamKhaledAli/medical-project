// Run this script with: node scripts/createAdminUser.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User.model.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function createAdmin() {
  await mongoose.connect(MONGO_URI);

  const password = "A123456789d.";
  const hashedPassword = await bcrypt.hash(password, 12);

  const admin = await User.create({
    email: "admin@example.com",
    password: hashedPassword,
    role: "admin",
    isVerified: true,
    status: "approved",
    isBlocked: false,
    fullName: "Admin User"
  });

  console.log("Admin user created:", admin.email);
  await mongoose.disconnect();
}

createAdmin().catch(err => {
  console.error("Error creating admin user:", err);
  process.exit(1);
});
