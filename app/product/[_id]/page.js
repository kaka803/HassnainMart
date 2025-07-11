'use client';

import ProductActions from "@/app/components/ProductActions";
import { Truck, RotateCcw } from 'lucide-react';
import Navbar from "@/app/components/navbar";
import { useProductContext } from "@/app/context/productcontext";
import { useAuthContext } from "@/app/context/authContext";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCartContext } from "@/app/context/cartContext";
import { SyncLoader } from "react-spinners";

export default function Page() {
  const [cartLoading, setcartLoading] = useState(false);
  const { _id } = useParams();
  const { products, loading, error, count, setCount } = useProductContext();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [cartQuantity, setcartQuantity] = useState(0);

  const { authLoading, user, fetchUser } = useAuthContext();
  const { fetchCart, cart } = useCartContext();
  const router = useRouter();

  useEffect(() => { fetchUser(); }, []);

  const product = products.find(p => p._id === _id);

  useEffect(() => {
    if (product) {
      if (product.size && product.size[0]) {
        const firstSize = product.size[0].split(",")[0].trim();
        setSelectedSize(firstSize);
      }

      if (product.color && product.color[0]) {
        const firstColor = product.color[0].split(",")[0].trim().toLowerCase();
        setSelectedColor(firstColor);
      }
    }
  }, [product]);

  useEffect(() => { fetchCart(user?.id); }, [user]);

  useEffect(() => {
    const totalQuantity = cart?.reduce((total, item) => total + item.quantity, 0);
    setcartQuantity(totalQuantity);
  }, [cart]);

  const handleCart = async () => {
    setcartLoading(true);
    const res = await fetch("/api/addcart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quantity: count,
        selectedSize,
        selectedColor,
        productID: product._id,
        email: user.email
      })
    });
    const data = await res.json();
    setcartLoading(false);
    if (data.message) {
      alert(data.message);
      setCount(0);
    }
  };

  if (loading || authLoading)
    return <div className='w-full h-[90vh] flex justify-center items-center bg-white'><SyncLoader color="#DB4444" /></div>;

  if (error) return <div>Error loading product</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <>
      <Navbar cartQuantity={cartQuantity || 0} />

      <div className="max-w-[85%] mx-auto px-4 py-10 flex flex-col md:flex-row gap-10">
        {/* Left Image Section */}
        <div className="w-full md:w-1/2 flex justify-center items-center">
          <div className="bg-gray-100 w-full h-full  rounded-xl overflow-hidden flex justify-center items-center">
  <img
    src={product.image?.url || "/keyboard.svg"}
    alt={product.name}
    className="w-[50%] h-[50%] object-contain "
  />
</div>

        </div>

        {/* Right Details Section */}
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <h1 className="text-3xl font-semibold text-gray-900">{product.name}</h1>

          <div className="flex items-center gap-2">
            {[...Array(5)].map((_, idx) => (
              <img key={idx} src="/goldenstar.svg" alt="star" className="w-4 h-4" />
            ))}
            <span className="text-sm text-gray-600">(150 reviews) | <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span></span>
          </div>

          <div className="text-2xl font-bold text-[#db4444]">
            {product.onSale ? (
              <>
                Rs. {new Intl.NumberFormat().format(product.discountedPrice)}
                <span className="text-sm text-gray-500 line-through ml-2">Rs. {new Intl.NumberFormat().format(product.originalPrice)}</span>
              </>
            ) : (
              <>Rs. {new Intl.NumberFormat().format(product.originalPrice)}</>
            )}
          </div>

          <p className="text-gray-700 text-sm leading-relaxed">
            {product.description || 'No description provided.'}
          </p>

          <p className="text-sm text-gray-600">Category: <span className="text-black font-medium">{product.category}</span></p>
          <p className="text-sm text-gray-600">Available Quantity: <span className="text-black font-medium">{product.stock}</span></p>

          {/* Colors */}
          <div>
            <label className="text-sm font-medium text-gray-800">Colours:</label>
            <div className="flex items-center gap-2 mt-1">
              {product.color[0].split(",").map((clr, idx) => (
                <div key={idx}>
                  <input
                    type="radio"
                    name="selectedColor"
                    value={clr.trim()}
                    id={`color-${idx}`}
                    className="hidden peer"
                    onChange={(e) => setSelectedColor(e.target.value)}
                  />
                  <label
                    htmlFor={`color-${idx}`}
                    className="w-6 h-6 rounded-full border border-gray-300 block cursor-pointer peer-checked:ring-2 peer-checked:ring-black"
                    style={{ backgroundColor: clr.trim().toLowerCase() }}
                  ></label>
                </div>
              ))}
            </div>
            <p className="text-sm mt-1">Selected Color: {selectedColor}</p>
          </div>

          {/* Sizes */}
          <div className="text-sm font-medium text-gray-800">
            Size:
            <div className="flex flex-wrap gap-2 mt-1">
              {product.size[0].split(",").map((size, idx) => {
                const trimmedSize = size.trim();
                return (
                  <div key={idx}>
                    <input
                      type="radio"
                      name="selectedSize"
                      value={trimmedSize}
                      id={`size-${idx}`}
                      className="hidden peer"
                      checked={selectedSize === trimmedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                    />
                    <label
                      htmlFor={`size-${idx}`}
                      className="px-3 py-1 rounded-md border border-black cursor-pointer hover:bg-[#db4444] hover:text-white peer-checked:bg-[#db4444] peer-checked:text-white"
                    >
                      {trimmedSize}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>

          <ProductActions handleCart={handleCart} cartLoading={cartLoading} stock={product.stock} />

          {/* Delivery Info */}
          <div className="border rounded w-full mt-6">
            <div className="flex items-start gap-3 p-4 border-b">
              <Truck className="w-5 h-5 mt-1 text-black" />
              <div>
                <h3 className="font-medium text-black text-sm">Free Delivery</h3>
                <p className="text-xs text-gray-600">
                  <a href="#" className="text-black underline">Enter your postal code</a> for Delivery Availability
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4">
              <RotateCcw className="w-5 h-5 mt-1 text-black" />
              <div>
                <h3 className="font-medium text-black text-sm">Return Delivery</h3>
                <p className="text-xs text-gray-600">
                  Free 30 Days Delivery Returns. <a href="#" className="underline">Details</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}