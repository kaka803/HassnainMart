import { connectDb } from "@/lib/db";
import { User } from "@/models/user";
import { generateOtp } from "@/lib/generateotp";
import { sendEmail } from "@/lib/sendEmail";

export const POST = async (req) => {
  try {
    const { email } = await req.json();
    await connectDb();

    const user = await User.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    if (user.isVerified) {
      return new Response(JSON.stringify({ message: "User already verified" }), { status: 400 });
    }

    const { otp, expires } = generateOtp();

    user.otp = otp;
    user.otpExpires = expires;
    await user.save();

    await sendEmail(otp, email);

    return new Response(JSON.stringify({ message: "OTP resent successfully" }), { status: 200 });
  } catch (error) {
    console.error("Resend OTP Error:", error);
    return new Response(JSON.stringify({ error: "Something went wrong" }), { status: 500 });
  }
};
