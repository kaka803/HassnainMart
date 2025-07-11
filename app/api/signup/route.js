import bcrypt from "bcryptjs";
import { User } from "@/models/user";
import { generateOtp } from "@/lib/generateotp";
import { sendEmail } from "@/lib/sendEmail";
import { connectDb } from "@/lib/db";

export const POST = async (req) => {
  const { name, email, password } = await req.json();
  await connectDb();

  try {
    const existingUser = await User.findOne({ email });

    // ✅ Case 1: User exists and is verified
    if (existingUser && existingUser.isVerified) {
      return new Response(JSON.stringify({ error: "User already exists" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { otp, expires } = generateOtp();
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Case 2: User exists but not verified → update OTP & password
    if (existingUser && !existingUser.isVerified) {
      existingUser.name = name;
      existingUser.password = hashedPassword;
      existingUser.otp = otp;
      existingUser.otpExpires = expires;

      await existingUser.save();
      await sendEmail(otp, email);

      return new Response(JSON.stringify({ message: "OTP sent successfully (updated existing user)" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // ✅ Case 3: New user → create
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpires: expires,
      isVerified: false,
    });

    await newUser.save();
    await sendEmail(otp, email);

    return new Response(JSON.stringify({ message: "OTP sent successfully" }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in signup:", error);
    return new Response(JSON.stringify({ error: "Failed to process registration" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
