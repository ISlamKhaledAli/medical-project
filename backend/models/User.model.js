import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
    },
    role: {
      type: String,
      enum: ["admin", "doctor", "patient"],
      default: "patient",
    },
    isApproved: {
      type: Boolean,
      default: function () {
        return this.role === "patient";
      },
    },
    isBlocked: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    verificationToken: String,
    verificationTokenExpires: Date,

    resetpasswordToken: String,
    resetpasswordTokenExpires: Date,

    refreshToken: String,
    passwordChangedAt: Date,
  },
  { timestamps: true },
);

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.refreshToken;
  delete user.verificationToken;
  delete user.verificationTokenExpires;
  delete user.resetpasswordToken;
  delete user.resetpasswordTokenExpires;
  return user;
};

export default mongoose.model("User", userSchema);
