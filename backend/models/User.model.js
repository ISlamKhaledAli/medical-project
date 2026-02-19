import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: { type: String, required: true },
        role: {
            type: String,
            enum: ["admin", "doctor", "patient"],
            default: "patient",
        },
        isApproved: { type: Boolean, default: false },
        isBlocked: { type: Boolean, default: false },
        isVerified: { type: Boolean, default: false },
        verificationToken: String,
        verificationTokenExpires: Date,
        refreshToken: String,
    },
    { timestamps: true }
);

userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    delete user.refreshToken;
    delete user.verificationToken;
    return user;
};

export default mongoose.model("User", userSchema);
