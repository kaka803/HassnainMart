// app/cart/page.tsx
'use client'
import { X } from "lucide-react";
import Navbar from "../components/navbar";
import { useCartContext } from "../context/cartContext";
import { useAuthContext } from "../context/authContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import MiniSpinner from "../components/loading";
import Link from "next/link";
import { SyncLoader } from "react-spinners";

export default function CartPage() {

  const { fetchCart, cart, updateCartQuantity } = useCartContext()
  const { authLoading, user, fetchUser } = useAuthContext()
  const [localCart, setLocalCart] = useState([]);
  const [cartChanged, setCartChanged] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [CartLoading, setCartLoading] = useState(false)
  const [deletingloading, setdeletingloading] = useState(false)


  const router = useRouter()


  // user ko fetch karne k liye use effect
  useEffect(() => {

    fetchUser()
  }, []);

// cart ko fetch karne k liye use effect
  

// local cart mai store karna 
  useEffect(() => {
    if (cart) {
      console.log(cart);
      
      setLocalCart(cart);
    }
  }, [cart]);

  // quantity change karne k liye

  const handleQuantityChange = (productId, type) => {
    const updated = localCart.map(item => {
      if (item.product._id === productId) {
        const newQty = type === "inc" ? item.quantity + 1 : item.quantity - 1;
        return {
          ...item,
          quantity: newQty < 1 ? 1 : newQty
        };
      }
      return item;
    });
    setLocalCart(updated);
    setCartChanged(true);
  };

  const handleUpdateCart = async () => {
    try {
      setCartLoading(true)
      for (let item of localCart) {
        await updateCartQuantity(user.email, item.product._id, item.quantity);
      }
      setCartChanged(false);
      setCartLoading(false)
    } catch (error) {
      console.error("Update failed", error);
    }
  };


  const handleDeleteItem = async (productId) => {

    setDeletingProductId(productId);
    
    try {
      const res = await fetch("api/deletecart", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    id: productId
  })
});

      const data = await res.json();

      if (data.success) {
  console.log("Deleted:", data);

  setLocalCart((prevCart) =>
    prevCart.filter(
      (item) => item._id.toString() !== productId.toString()
    )
  );
}

    } catch (error) {
      console.error("Error deleting item:", error);
    } finally {
      setDeletingProductId(null);
    }
  };

 const subtotal = localCart.reduce((acc, item) => {
  const price = item.product.onSale ? item.product.discountedPrice : item.product.originalPrice;
  return acc + price * item.quantity;
}, 0);
  const shipping = subtotal > 2000 ? 0 : 100;
  const total = subtotal + shipping;

  const cartQuantity = localCart.reduce(
  (total, item) => total + item.quantity,
  0
);


  if (authLoading) {
    return <div className='w-full h-[90vh] flex justify-center items-center bg-white'><SyncLoader color="#DB4444" /></div>
  }

  return (
    <>
      <Navbar
      cartQuantity={cartQuantity}
       />
      <div className="max-w-[85%] mx-auto py-10">
        
        <div className="border rounded-md overflow-hidden">
          <div className="grid grid-cols-4 bg-gray-50 text-sm font-semibold text-gray-700 p-4">
            <div>Product</div>
            <div>Price</div>
            <div>Quantity</div>
            <div>Subtotal</div>
          </div>

          {localCart.map((item) => (
            <div key={item._id} className="grid grid-cols-4 items-center border-t p-4">
              <div className="flex md:flex-row flex-col items-center space-x-3">
                <img src={item.product.image.url} alt="Product" width={50} height={50} />
                <span className="font-medium text-sm">{item.product.name}</span>
              </div>

              <div>{item.product.onSale ? item.product.discountedPrice : item.product.originalPrice}</div>

              <div className="flex md:flex-row flex-col items-center border rounded px-2 py-1 w-fit">
                <button onClick={() => handleQuantityChange(item.product._id, "dec")} className="px-2 grid items-center">-</button>
                <span className="px-3 w-6 text-center">{item.quantity}</span>
                <button onClick={() => handleQuantityChange(item.product._id, "inc")} className="px-2 grid items-center">+</button>
              </div>

              <div className="flex items-center gap-2">
                <span>
  Rs.{" "}
  {new Intl.NumberFormat("en-US").format(
    (item.product.onSale
      ? Number(item.product.discountedPrice)
      : Number(item.product.originalPrice)) * Number(item.quantity)
  )}
</span>



                <button
                  onClick={() => handleDeleteItem(item._id)}
                  className={`text-red-500 hover:text-red-700 transition-all ${deletingProductId === item._id ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  disabled={deletingProductId === item.product._id}
                >
                  {deletingProductId === item.product._id ? (
                    <svg
                      className="animate-spin h-4 w-4 text-red-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                      ></path>
                    </svg>
                  ) : (
                    <X className="w-4 h-4" /> // 👈 beautiful cross icon
                  )}
                </button>
              </div>
            </div>
          ))}

        </div>

        <div className="flex flex-wrap justify-between mt-6 gap-4">
          <button className="border rounded px-5 py-2 text-sm hover:bg-gray-100">
            Return To Shop
          </button>
          <button
            className={`border w-[140px] flex justify-center items-center rounded px-5 py-2 text-sm ${cartChanged ? "bg-red-500 text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            onClick={handleUpdateCart}
            disabled={!cartChanged}
          >
            {CartLoading ? <MiniSpinner/> :'Update Cart'}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row justify-between mt-10 gap-6">
          
          <div className="flex h-13 gap-2 max-w-md w-full">
            <input
              type="text"
              placeholder="Coupon Code"
              className="border px-3 py-2 rounded w-full text-sm"
            />
            <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm">
              Apply Coupon
            </button>
          </div>


          <div className="border rounded-md p-6 w-full max-w-sm">
            <h2 className="text-md font-semibold mb-4">Cart Total</h2>

            <div className="flex justify-between text-sm mb-2">
              <span>Subtotal</span>
              <span>Rs. {new Intl.NumberFormat('en-US').format(subtotal)}</span>
            </div>

            <div className="flex justify-between text-sm mb-2">
              <span>Shipping:</span>
              <span>{shipping === 0 ? "Free" : `$${shipping}`}</span>
            </div>

            <div className="border-t my-2"></div>

            <div className="flex justify-between text-sm font-medium mb-4">
              <span>Total:</span>
              <span>Rs. {new Intl.NumberFormat('en-US').format(total)}</span>
            </div>

            <Link href={'/checkout'}>
            <button className="bg-red-500 hover:bg-red-600 w-full text-white py-2 rounded text-sm">
              Proceed to Checkout
            </button>
            </Link>
          </div>

        </div>
      </div>
    </>
  );
}
