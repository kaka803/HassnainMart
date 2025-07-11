'use client'
import { Minus, Plus, Heart } from 'lucide-react';
import { useState } from 'react';
import { useProductContext } from '../context/productcontext';
import MiniSpinner from './loading';

export default function ProductActions({handleCart, cartLoading, stock}) {
  const {count, setCount} = useProductContext()

  return (
    <div className="flex items-center gap-3">
      {/* Counter */}
      <div className="flex border rounded overflow-hidden h-10">
        <button
          onClick={() => setCount(count - 1)}
          className="w-8 flex items-center justify-center border-r bg-[#DB4444] text-white"
        >
          <Minus size={16} />
        </button>
        <div className="w-8 flex items-center justify-center font-medium">{count}</div>
        <button
          onClick={() => setCount(prev => prev + 1)}
          className="w-8 flex items-center justify-center bg-[#DB4444] text-white"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Buy Now Button */}
      <button
      disabled={cartLoading || stock === 0}
       onClick={() => handleCart()} className="bg-[#DB4444] w-[129px] flex justify-center items-center text-white px-5 h-10 rounded">{cartLoading ? <MiniSpinner/>:'Add to Cart'}</button>

      {/* Heart Icon */}
      <button className="border rounded w-10 h-10 flex items-center justify-center">
        <Heart size={18} />
      </button>
    </div>
  );
}
