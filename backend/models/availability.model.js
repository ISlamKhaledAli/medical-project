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
    slotDuration: { type: Number, default: 30 },
});

export default mongoose.model("Availability", availabilitySchema);