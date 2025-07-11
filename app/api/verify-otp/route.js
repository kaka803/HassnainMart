import { connectDb } from "@/lib/db";
import { User } from "@/models/user";

export async function POST(request) {
  
    const { email, otp } = await request.json();
    
    await connectDb();

    const user = await User.findOne({email})
    if (!user) {
        return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }
    if (user.otp !== otp) {
        return new Response(JSON.stringify({ error: "Invalid OTP" }), { status: 400 });
    }
    if (user.isVerified) {
        return new Response(JSON.stringify({ error: "User already verified" }), { status: 400 });
    }
    if (user.otpExpires < new Date()) {
        return new Response(JSON.stringify({ error: "OTP expired" }), { status: 400 });
    }
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();
    return new Response(JSON.stringify({ message: "User verified successfully" }), { status: 200 });
  }