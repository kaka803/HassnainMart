'use client';

import Image from 'next/image';
import Navbar from '../components/navbar';

export default function AboutPage() {
  return (
    <>
    <Navbar/>
    <div className="max-w-[90%] mx-auto mt-10 pb-20">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">About Us</h1>
        <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
          Welcome to <span className="text-[#DB4444] font-semibold">Exclusive</span> – where innovation meets passion. We’re on a mission to make your shopping experience seamless, modern, and trustworthy.
        </p>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Image */}
        <div className="w-full h-full">
          <Image
            src="/aboutimage.svg" // Replace with your own image path
            alt="About Us"
            width={600}
            height={400}
            className="rounded-lg shadow-md w-full object-cover"
          />
        </div>

        {/* Text Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Who We Are</h2>
          <p className="text-gray-600 leading-relaxed text-sm md:text-base mb-4">
            Founded in 2024, Exclusive started with a simple goal: make quality products accessible to everyone. From the latest tech gadgets to everyday essentials — we handpick every product with care.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">What We Believe</h3>
          <ul className="list-disc list-inside text-gray-600 text-sm md:text-base space-y-1">
            <li>Customer satisfaction is our top priority</li>
            <li>Affordable prices without compromising quality</li>
            <li>Secure shopping with fast delivery</li>
            <li>Transparency, honesty & constant improvement</li>
          </ul>

          <div className="mt-6">
            <p className="text-gray-700 text-sm md:text-base">
              Thank you for being a part of our journey. We’re excited to continue growing with your support!
            </p>
            <p className="mt-2 text-sm text-gray-500 italic">– The Exclusive Team</p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
