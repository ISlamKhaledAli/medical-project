import mongoose from "mongoose";

const specialtySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.model("Specialty", specialtySchema);
