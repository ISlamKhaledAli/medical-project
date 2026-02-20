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
doctorSchema.index({ specialty: 1 });
doctorSchema.index({ rating: -1 });
doctorSchema.index({ experienceYears: -1 });
doctorSchema.index({ createdAt: -1 });

export default mongoose.model("DoctorProfile", doctorSchema);