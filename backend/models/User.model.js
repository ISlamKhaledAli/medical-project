import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ["admin", "doctor", "patient"],
        required: true,
    },
    isApproved: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);