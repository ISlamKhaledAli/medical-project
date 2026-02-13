import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    specialty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Specialty",
        required: true,
    },
    bio: String,
    experienceYears: Number,
    consultationFee: Number,
    address: String,
}, { timestamps: true });

module.exports = mongoose.model("DoctorProfile", doctorSchema);