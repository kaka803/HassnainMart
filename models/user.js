import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  otp: String,
  otpExpires: Date,
  isVerified: {
    type: Boolean,
    default: false,
  },
  password: String,
  address: String,
  
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);