'use client'
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MyCenteredAlert from "../components/alert";
import MiniSpinner from "../components/loading";
export default function SignupPage() {
  const [name, setname] = useState('')
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

    const router = useRouter();

    const handleSubmit = async (e) => {

        e.preventDefault();
        setLoading(true);
        const res = await fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        setLoading(false);
        if(data.error) {
            setError(data.error)
        }
        else if(data.message) {
            alert(data.message);
            router.push(`/otpverify?email=${email}`);
        }
        
    }
    useEffect(() => {
      
      console.log(name, email, password);
    }, [name, email , password])
    
    
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
      <div className="w-1/2 bg-[#cce4e9] hidden md:flex items-center justify-center">
        <div className="relative w-120 h-120">
          <Image
            src="/singupImage.png" // Replace this with your actual image path
            alt="Shopping graphic"
            fill 
            objectFit="contain"
          />
        </div>
      </div>

      {/* Right side form */}
      <div className="w-[100%] md:w-1/2 flex flex-col justify-center px-8 md:px-20 py-12">
  <h2 className="text-3xl font-semibold mb-2 text-gray-900">Create an account</h2>
  <p className="text-sm text-gray-500 mb-6">Enter your details below</p>

  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
     <input
     value={name}
     onChange={(e) => setname(e.target.value)}
            type="text"
            placeholder="Name"
            className="border-b border-b-gray-300 focus:border-b-black outline-none px-2 py-3"
          />
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


    <Button
    disabled={loading}
    type="submit"
     className="bg-[#db4444] hover:bg-[#663434] text-white py-2 rounded mt-2">
      {loading ? <MiniSpinner/>:'Create Account'}
    </Button>

    
  </form>

  <p className="text-sm text-center mt-6 text-gray-600">
    Already have an account?{" "}
    <a href="/login" className="text-black underline font-medium">Log in</a>
  </p>
</div>

    </div>
  );
}
