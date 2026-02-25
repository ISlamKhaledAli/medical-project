import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    specialty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Specialty",
      required: true,
    },
    bio: { type: String, maxlength: [500, 'Bio cannot exceed 500 characters'] },
    experienceYears: { type: Number, min: [0, 'Experience cannot be negative'] },
    consultationFee: { type: Number, min: [1, 'Fee must be greater than 0'] },
    address: { type: String, required: true },
  },
  { timestamps: true },
);
doctorSchema.index({ specialty: 1 });
doctorSchema.index({ rating: -1 });
doctorSchema.index({ experienceYears: -1 });
doctorSchema.index({ createdAt: -1 });

export default mongoose.model("DoctorProfile", doctorSchema);
