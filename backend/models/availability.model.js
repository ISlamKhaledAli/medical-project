import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DoctorProfile",
    required: true,
  },
  dayOfWeek: { type: Number, min: 0, max: 6 },
  startTime: String,
  endTime: String,
  slotDurationMinutes: { type: Number, default: 30 },
  isActive: { type: Boolean, default: true },
});

availabilitySchema.index({ doctor: 1, dayOfWeek: 1 }, { unique: true });

export default mongoose.model("Availability", availabilitySchema);
