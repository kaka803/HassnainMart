'use client'

import Link from 'next/link'
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-12 pb-6 mt-10">
      <div className="max-w-[85%] mx-auto grid md:grid-cols-4 sm:grid-cols-2 gap-8">
        
        {/* Brand & Newsletter */}
        <div className='text-center md:text-left'>
          <h2 className="text-xl font-bold mb-4">EcommStore</h2>
          <p className="text-sm mb-4 text-gray-400">
            Get the latest updates on new products and upcoming sales
          </p>
          <div className="flex items-center bg-white rounded overflow-hidden">
            <input
              type="email"
              placeholder="Your email"
              className="px-3 py-2 w-full text-black focus:outline-none"
            />
            <button className="bg-gray-700 text-white px-4 py-2 hover:bg-gray-600 transition-all">
              Subscribe
            </button>
          </div>
        </div>

        {/* Shop Links */}
        <div className='text-center md:text-left'>
          <h3 className="text-lg font-semibold mb-4">Shop</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link href="/products" className="hover:text-white">All Products</Link></li>
            <li><Link href="/categories" className="hover:text-white">Categories</Link></li>
            <li><Link href="/new-arrivals" className="hover:text-white">New Arrivals</Link></li>
            <li><Link href="/trending" className="hover:text-white">Trending</Link></li>
          </ul>
        </div>

        {/* Support Links */}
        <div className='text-center md:text-left'>
          <h3 className="text-lg font-semibold mb-4">Support</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
            <li><Link href="/faq" className="hover:text-white">FAQs</Link></li>
            <li><Link href="/returns" className="hover:text-white">Return Policy</Link></li>
            <li><Link href="/shipping" className="hover:text-white">Shipping Info</Link></li>
          </ul>
        </div>

        {/* Social Links */}
        <div className='text-center md:text-left'>
          <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
          <div className="flex gap-4 text-xl text-gray-400">
            <Link href="#"><FaFacebookF className="hover:text-white" /></Link>
            <Link href="#"><FaInstagram className="hover:text-white" /></Link>
            <Link href="#"><FaTwitter className="hover:text-white" /></Link>
            <Link href="#"><FaYoutube className="hover:text-white" /></Link>
          </div>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="mt-10 text-center text-gray-500 text-sm border-t border-gray-700 pt-4">
  &copy; {new Date().getFullYear()} EcommStore. All rights reserved. <br />
  Developed with ❤️ by <span className="text-gray-500 font-medium">Hassnain</span>
</div>
    </footer>
  )
}
