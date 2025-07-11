'use client'
import React, { useEffect } from 'react'
import Navbar from '../components/navbar'
import { useProductContext } from '../context/productcontext';
import Link from 'next/link';
import { useAuthContext } from '../context/authContext';
import { useRouter } from 'next/navigation';
import { useCartContext } from '../context/cartContext';
import { useState } from 'react';
import { SyncLoader } from 'react-spinners';

const Store = () => {
    const { products, loading, error } = useProductContext();
      const {authLoading, user, fetchUser}  = useAuthContext()  
        const { fetchCart, cart, updateCartQuantity } = useCartContext()
        const [cartQuantity, setcartQuantity] = useState(0)
    
    
    const router = useRouter()
      useEffect(() => {
        fetchUser()
      }, []);

     useEffect(() => {
    fetchCart(user?.id);

  }, [user])

  useEffect(() => {
    const totalQuantity = cart?.reduce(
  (total, item) => total + item.quantity,
  0
    )
    setcartQuantity(totalQuantity)
  }, [cart])
  

    if(authLoading || loading){
      return <div className='w-full h-[90vh] flex justify-center items-center bg-white'><SyncLoader color="#DB4444" /></div>
    }


    function salePercentage(originalPrice, discountedPrice) {
  const percent = ((originalPrice - discountedPrice) * 100) / originalPrice;
  return Math.round(percent); // optional: round off to nearest integer
}

    
  return (
    <>
    <Navbar
    cartQuantity={cartQuantity ? cartQuantity : 0}
    />
    <div className='max-w-[85%] m-auto '>
        <h1 className="text-2xl text-center  md:text-3xl font-semibold  mt-6 text-gray-800 mb-6">
  Explore Our Products
</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-10 place-items-center">

          {
            products.map((product) => {
              return <Link key={product._id} href={`product/${product._id}`}>
  <div className="w-45 h-62 group flex flex-col items-start justify-center cursor-pointer">
    <div className="w-full h-45 bg-[rgb(245,245,245)] rounded-[3px] relative overflow-hidden">
      <div className="flex justify-center items-center w-full h-full">
        <img src={product.image?.url} alt={product.name} className="w-[70%] object-contain" />
      </div>

      {
        product?.onSale && <div className='bg-[#db4444] text-white absolute top-1 left-1 w-[43px] h-[23px] flex justify-center items-center rounded-[5px] text-[13px]'>
        {`-${salePercentage(product.originalPrice, product.discountedPrice)}%`}
      </div>
      }

      {/* Hover Button */}
      <div className="absolute bottom-[-100%] w-full bg-black text-white h-8 flex justify-center items-center group-hover:bottom-0 transition-all duration-500">
        Add to Cart
      </div>
    </div>

    {/* Product Name */}
    <p className="text-[14px] font-medium font-[system-ui] mt-1">{product.name}</p>

    {/* Price Section */}
    <div className="flex items-center gap-2">
      {product.onSale ? (
        <>
          <p className="text-sm text-gray-400 line-through"><span>
  Rs.{" "}
  {new Intl.NumberFormat("en-US").format(Number(product.originalPrice))}
</span></p>
          <p className="text-[15px] font-medium text-[#db4444]"> <span>
  Rs.{" "}
  {new Intl.NumberFormat("en-US").format(Number(product.discountedPrice))}
</span></p>
        </>
      ) : (
        <p className="text-[15px] font-medium text-[#db4444]"><span>
  Rs.{" "}
  {new Intl.NumberFormat("en-US").format(Number(product.originalPrice))}
</span></p>
      )}
    </div>
  </div>
</Link>

            })
          }
            
            
        </div>
      
    </div>
    </>
  )
}

export default Store
