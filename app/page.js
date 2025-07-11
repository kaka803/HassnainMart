'use client'
import Image from 'next/image'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Link from 'next/link'
import Autoplay from "embla-carousel-autoplay"

import { useRef, useState, useEffect } from "react"
import { useProductContext } from './context/productcontext'
import Footer from './components/footer'
import FaqSection from './components/faq'
import TestimonialSection from './components/testimonial'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { Menu, X, Search, Heart, ShoppingCart } from 'lucide-react'


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { SyncLoader } from 'react-spinners'





export default function Hero() {
  const { products, loading, error } = useProductContext();
  const pathname = usePathname()
    const [menuOpen, setMenuOpen] = useState(false)
    const [user, setuser] = useState(null)
  const [authLoading, setauthLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const router = useRouter()
    const navLinks = [
      { href: '/', label: 'Home' },
      { href: '/store', label: 'Store' },
      { href: '/about', label: 'About' },
      { href: '/myorders', label: 'My Orders'}
    ]
  
    const logout = () => {
      localStorage.removeItem('token')
      setuser(null)
      router.push('/login')
    }
    useEffect(() => {
     const fetchUser = async () => {
    const token = localStorage.getItem('token')
    setauthLoading(true)
      const res = await fetch("/api/protected", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    

  const data =  await res.json();
  
  if(data.user){

    setuser(data.user)
    setauthLoading(false)
  }
    }
    fetchUser()
    }, [])
    
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





function salePercentage(original, discounted) {
  return Math.round(((original - discounted) / original) * 100)
}
  const autoplayTrending = useRef(Autoplay({ delay: 2000 }))
const autoplayBestSelling = useRef(Autoplay({ delay: 3000 }))


  if(loading){
    return <div className='w-full h-[90vh] flex justify-center items-center'><SyncLoader
    color="#DB4444"
    /></div>
  }
  return (
    <>
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
                { 0}
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
                    <Link href={`/profile/${user.id}`}>My Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-red-500 hover:bg-red-50"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : <Link
                href="/login"
                className="bg-[#DB4444] text-sm text-white px-2 py-1 rounded-lg hover:bg-[#c13535] transition-all"
              >
               login
              </Link>}

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
      <section className="w-full h-[80vh] bg-white flex items-center my-30 md:my-0">
        <div className="max-w-[85%] mx-auto flex flex-col-reverse justify-center w-full md:justify-between md:flex-row items-center gap-3 md:gap-12">
          
          {/* Left Content */}
          <div className='flex flex-col justify-center items-center md:items-start'>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight md:text-left text-center">
              Upgrade Your Style with <span className="text-[#DB4444]">Modern Fashion</span>
            </h1>
            <p className="mt-4 text-gray-600 text-lg md:text-left text-center">
              Discover premium quality products designed for your lifestyle. Shop now and experience the new trend!
            </p>
            <div className="mt-6 flex gap-4">
              <Link
                href="/store"
                className="bg-[#DB4444] text-white px-6 py-3 rounded-lg hover:bg-[#c13535] transition-all"
              >
                Shop Now
              </Link>
              <Link
                href="/contact"
                className="text-[#DB4444] font-medium border-[1px] border-[#DB4444] px-6 py-3 rounded-lg hover:bg-[#DB4444] hover:text-white transition-all"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative w-full h-80 md:h-[35rem]">
            <Image
              src="/heroimage.png"
              alt="Hero Image"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </section>


<section className="w-full py-12 bg-white">
      <div className="max-w-[85%] mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 ">Trending Products</h2>
          
        </div>

        <Carousel opts={{
    align: "center", // <— this is the key line
  }} plugins={[autoplayTrending.current]} className="w-full">
  {/* Carousel Arrows Inside */}
  <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 z-10" />
  <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 z-10" />

  {/* Fix margin/padding and spacing */}
  <CarouselContent className="px-2">
    {products?.filter((product => product.onSale === true) ).map((product) => (
      <CarouselItem
        key={product._id}
        className="md:basis-1/4 sm:basis-1/2 basis-[80%] pl-2 flex justify-center items-center"
      >
        <Link href={`/product/${product._id}`}>
          <div className="w-full group flex flex-col items-start justify-center cursor-pointer">
            {/* Card structure */}
            <div className="w-45 h-52 bg-[rgb(245,245,245)] rounded-[3px] relative overflow-hidden">
              <div className="flex justify-center items-center w-full h-full">
                <img
                  src={product.image?.url}
                  alt={product.name}
                  className="w-[70%] object-contain"
                />
              </div>

              {product?.onSale && (
                <div className="bg-[#db4444] text-white absolute top-1 left-1 w-[43px] h-[23px] flex justify-center items-center rounded-[5px] text-[13px]">
                  {`-${salePercentage(product.originalPrice, product.discountedPrice)}%`}
                </div>
              )}

              {/* Hover Button */}
              <div className="absolute bottom-[-100%] w-full bg-black text-white h-8 flex justify-center items-center group-hover:bottom-0 transition-all duration-500">
                Add to Cart
              </div>
            </div>

            {/* Name */}
            <p className="text-[14px] w-45 font-medium font-[system-ui] mt-1">
              {product.name}
            </p>

            {/* Price */}
            <div className="flex items-center gap-2">
              {product.onSale ? (
                <>
                  <p className="text-sm text-gray-400 line-through">
                    Rs.{product.originalPrice}
                  </p>
                  <p className="text-[15px] font-medium text-[#db4444]">
                    Rs.{product.discountedPrice}
                  </p>
                </>
              ) : (
                <p className="text-[15px] font-medium text-[#db4444]">
                  Rs.{product.originalPrice}
                </p>
              )}
            </div>
          </div>
        </Link>
      </CarouselItem>
    ))}
  </CarouselContent>
</Carousel>

      </div>
    </section>
<section className="w-full py-12 bg-white">
      <div className="max-w-[85%] mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 ">Best Selling Products</h2>
          
        </div>

        <Carousel opts={{
    align: "center", // <— this is the key line
  }} plugins={[autoplayBestSelling.current]} className="w-full">
  {/* Carousel Arrows Inside */}
  <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 z-10" />
  <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 z-10" />

  {/* Fix margin/padding and spacing */}
  <CarouselContent className="px-2">
    {products?.map((product) => (
      <CarouselItem
        key={product._id}
        className="md:basis-1/4 sm:basis-1/2 basis-[80%] pl-2 flex justify-center items-center"
      >
        <Link href={`/product/${product._id}`}>
          <div className="w-full group flex flex-col items-start justify-center cursor-pointer">
            {/* Card structure */}
            <div className="w-45 h-52 bg-[rgb(245,245,245)] rounded-[3px] relative overflow-hidden">
              <div className="flex justify-center items-center w-full h-full">
                <img
                  src={product.image?.url}
                  alt={product.name}
                  className="w-[70%] object-contain"
                />
              </div>

              {product?.onSale && (
                <div className="bg-[#db4444] text-white absolute top-1 left-1 w-[43px] h-[23px] flex justify-center items-center rounded-[5px] text-[13px]">
                  {`-${salePercentage(product.originalPrice, product.discountedPrice)}%`}
                </div>
              )}

              {/* Hover Button */}
              <div className="absolute bottom-[-100%] w-full bg-black text-white h-8 flex justify-center items-center group-hover:bottom-0 transition-all duration-500">
                Add to Cart
              </div>
            </div>

            {/* Name */}
            <p className="text-[14px] w-45 font-medium font-[system-ui] mt-1">
              {product.name}
            </p>

            {/* Price */}
            <div className="flex items-center gap-2">
              {product.onSale ? (
                <>
                  <p className="text-sm text-gray-400 line-through">
                    Rs.{product.originalPrice}
                  </p>
                  <p className="text-[15px] font-medium text-[#db4444]">
                    Rs.{product.discountedPrice}
                  </p>
                </>
              ) : (
                <p className="text-[15px] font-medium text-[#db4444]">
                  Rs.{product.originalPrice}
                </p>
              )}
            </div>
          </div>
        </Link>
      </CarouselItem>
    ))}
  </CarouselContent>
</Carousel>

      </div>
    </section>
    <FaqSection/>
    <TestimonialSection/>
    </>
  )
}
