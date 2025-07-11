'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useRouter, useSearchParams } from "next/navigation";

export default function OtpVerificationPage() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [resending, setResending] = useState(false);
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const router = useRouter();

  const verifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length < 6) {
      alert("Please enter a valid 6-digit OTP.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.error) {
        alert(data.error);
      } else if (data.message) {
        alert(data.message);
        router.push('/login'); 
      }
    } catch (error) {
      setLoading(false);
      console.error("Error verifying OTP:", error);
      alert("An error occurred while verifying the OTP. Please try again.");
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    const res = await fetch("/api/resendotp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setResending(false);
    setMessage(data.message || data.error);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8 border border-gray-200">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Verify Your Email</h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          We have sent a 6-digit code to your email. Enter it below to verify your account.
        </p>
        <form onSubmit={verifyOtp} className="space-y-4">
          <div className="flex justify-center">
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <InputOTPSlot key={i} index={i} />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
          <Button type="submit" className="w-full bg-gray-800 text-white hover:bg-gray-900">
            {loading ? 'Verifying...' : 'Verify'}
          </Button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Didnot receive the code?{" "}
          <span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={handleResend}
          >
            {resending ? "Sending..." : "Resend"}
          </span>
        </p>
        {message && (
          <p className="text-center text-sm mt-2 text-green-600">{message}</p>
        )}
      </div>
    </div>
  );
}
