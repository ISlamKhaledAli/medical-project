import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DoctorProfile",
      required: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    appointmentDate: { type: Date, required: true },
    startTime: String,
    endTime: String,
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    doctorNotes: String,
  },
  { timestamps: true },
);

appointmentSchema.index(
  { doctor: 1, appointmentDate: 1, startTime: 1 },
  { unique: true },
);

export default mongoose.model("Appointment", appointmentSchema);
