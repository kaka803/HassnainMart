'use client'
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import MyCenteredAlert from "../components/alert";
import MiniSpinner from "../components/loading";

export default function LoginPage() {
    const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/adminlogin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    setLoading(false);

    console.log("admin Login Response:", data);
    if(data.error) {
      setError(data.error);
    }
    else if (data.token) {
      localStorage.setItem("admintoken", data.token);
      console.log("admin Login successful, token:", data.token);
      
      router.push("/admindashboard");
    } else {
      setError("Login failed. Please try again.");
    }
    
  };

  

  return (
    <div className="min-h-screen flex">
      {error && (
  <MyCenteredAlert
    title="Login Failed"
    description={error}
    type="error"
    onClose={() => setError("")}
  />
)}

      {/* Left side image */}
      <div className="w-1/2  bg-[#cce4e9] hidden md:flex items-center justify-center">
        <div className="relative w-120 h-120">
          <Image
            src="/singupImage.png" // Replace this with your actual image path
            alt="Login graphic"
            fill 
            objectFit="contain"
          />
        </div>
      </div>

      {/* Right side form */}
      <div className="w-full md:w-[45%] flex flex-col justify-center px-8 md:px-20 py-12">
        <h2 className="text-3xl font-semibold mb-2 text-gray-900">Admin Login</h2>
        <p className="text-sm text-gray-500 mb-6">Enter your credentials</p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email or Phone Number"
            className="border-b border-b-gray-300 focus:border-b-black outline-none px-2 py-3"
          />
          <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="border-b border-b-gray-300 focus:border-b-black outline-none px-2 py-3"
          />

          <button
            disabled={loading}
           type="submit" className="bg-[#db4444] hover:bg-[#663434] text-white py-2 rounded mt-2 flex justify-center items-center">
            {loading ? <MiniSpinner/>:'Log In'}
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-600">
          Don’t have an account?{' '}
          <a href="/signup" className="text-black underline font-medium">Sign up</a>
        </p>
      </div>
    </div>
  );
}
