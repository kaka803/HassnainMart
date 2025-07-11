'use client'
import React, { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X, Search, Heart, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuthContext } from '@/app/context/authContext'
import { useProductContext } from '../context/productcontext'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useRouter } from 'next/navigation'

export default function Navbar({ cartQuantity }) {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, setuser, authLoading } = useAuthContext()
  const [searchTerm, setSearchTerm] = useState('');
const [filteredProducts, setFilteredProducts] = useState([]);
  const {products} = useProductContext()
const router = useRouter()
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/store', label: 'Store' },
    { href: '/about', label: 'About' },
    { href: '/myorders', label: 'My Orders' },
  ]

  const logout = () => {
    localStorage.removeItem('token')
    setuser(null)
    router.push('/login')
  }
  const handleSearch = (e) => {
  const value = e.target.value;
  setSearchTerm(value);

  if (value.trim() === '') {
    setFilteredProducts([]);
    return;
  }

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(value.toLowerCase())
  );
  setFilteredProducts(filtered);
};

  return (
    <>
      {/* Top Banner */}
      <section className="bg-black text-white text-center">
        <div className="px-4 py-3 max-w-[92%] mx-auto font-light text-sm sm:text-base">
          Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!
          <a href="#" className="ml-2 hover:text-red-500 transition-all underline">
            Shop Now
          </a>
        </div>
      </section>

      {/* Navbar */}
      <nav className="border-b border-black relative z-[100] max-w-[85%] m-auto">
        <div className="flex items-center justify-between py-[21px] px-4 md:px-10 relative">
          {/* Logo */}
          <div className="text-[25px] font-bold z-10 text-[#DB4444]">HassnainMart</div>

          {/* Nav Links */}
          <div
            className={`${
              menuOpen ? 'block' : 'hidden'
            } absolute top-full left-0 w-full bg-white border-t border-gray-200 md:static md:block md:bg-transparent md:border-none`}
          >
            <ul className="flex flex-col md:flex-row justify-center items-center gap-5 py-4 md:py-0">
              {navLinks.map(({ href, label }) => (
                <li
                  key={label}
                  className={`transition-transform hover:scale-110 ${
                    pathname === href ? 'border-b border-black pb-1 scale-105' : ''
                  }`}
                >
                  <Link
                    href={href}
                    className="block text-[15px] text-black hover:text-[#683E00] px-3 py-1"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-4 z-10">
            {/* Search input (only md+) */}
            <div className="hidden md:block relative w-[220px] lg:w-[280px]">
              <input
  type="text"
  value={searchTerm}
  onChange={handleSearch}
  placeholder="What are you looking for?"
  className="w-full bg-[#f5f5f5] px-[21px] py-[10px] pr-12 rounded-[5px] text-sm placeholder:text-[#696969]"
/>
              <button className="absolute top-1/2 -translate-y-1/2 right-[15px]">
                <Search className="text-[#696969] w-[21px]" />
              </button>
            </div>
            {filteredProducts.length > 0 && (
  <div className="bg-white shadow-lg hidden md:block rounded-lg p-4 max-h-[300px] overflow-y-auto z-[200] absolute top-full w-full md:w-[280px]">
    <ul className="space-y-2">
      {filteredProducts.map((product) => (
        <li key={product._id}>
          <Link href={`/product/${product._id}`} className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded transition">
            <img
              src={product.image?.url || '/keyboard.svg'}
              alt={product.name}
              className="w-10 h-10 object-contain"
            />
            <span className="text-sm text-gray-800">{product.name}</span>
          </Link>
        </li>
      ))}
    </ul>
  </div>
)}


            {/* Icons */}
            <Heart className="text-black w-5 h-5" />
            <div className="relative">
              <Link href={'/cart'}>
                <ShoppingCart className="text-black w-5 h-5" />
              </Link>
              <div className="absolute -top-[8px] -right-[10px] bg-red-600 text-white text-[9px] w-[15px] h-[15px] rounded-full flex items-center justify-center">
                {cartQuantity || 0}
              </div>
            </div>

            {/* User Dropdown / Login */}
            {!authLoading && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <DropdownMenuTrigger asChild>
  <button className="w-7 h-7 rounded-full border bg-[#db4444] text-white flex items-center justify-center font-semibold text-sm hover:scale-105 transition">
    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
  </button>
</DropdownMenuTrigger>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="mt-2 w-40 bg-white z-300">
                  <DropdownMenuItem asChild>
                    <Link href={`/profile/${user._id}`}>My Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-red-500 hover:bg-red-50"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : ''}

            {/* Mobile Menu Button */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="block md:hidden">
              {menuOpen ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </div>

        {/* Mobile Search (under navbar) */}
        <div className="md:hidden px-4 pb-4">
          <input
  type="text"
  value={searchTerm}
  onChange={handleSearch}
  placeholder="What are you looking for?"
  className="w-full bg-[#f5f5f5] px-[21px] py-[10px] pr-12 rounded-[5px] text-sm placeholder:text-[#696969]"
/>
        </div>
        {filteredProducts.length > 0 && (
  <div className="bg-white md:hidden block shadow-lg rounded-lg p-4 max-h-[300px] overflow-y-auto z-[200] absolute top-full w-full md:w-[280px]">
    <ul className="space-y-2">
      {filteredProducts.map((product) => (
        <li key={product._id}>
          <Link href={`/product/${product._id}`} className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded transition">
            <img
              src={product.image?.url || '/keyboard.svg'}
              alt={product.name}
              className="w-10 h-10 object-contain"
            />
            <span className="text-sm text-gray-800">{product.name}</span>
          </Link>
        </li>
      ))}
    </ul>
  </div>
)}

      </nav>
    </>
  )
}
