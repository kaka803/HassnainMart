'use client';

import { useEffect, useState } from 'react';
import Navbar from '../components/navbar';
import { useCartContext } from '../context/cartContext';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '../context/authContext';
import OrderSuccessPopup from '../components/orderPopup';
import MiniSpinner from '../components/loading';


export default function CheckoutPage() {

    const {authLoading, user, fetchUser}  = useAuthContext()  
    const [orderSummary, setOrderSummary] = useState({
  subtotal: 0,
  shippingFee: 0,
  total: 0,
});
const [orderloading, setorderloading] = useState(false)
const [showPopup, setShowPopup] = useState(false);

      
    
    
    const router = useRouter()
      useEffect(() => {
        fetchUser()
      }, []);

    const {cart, loading} = useCartContext()
    
    
  const [form, setForm] = useState({
    firstName: '',
    companyName: '',
    streetAddress: '',
    apartment: '',
    city: '',
    country: '',
    phone: '',
    email: '',
    paymentMethod: 'COD'
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePlaceOrder = async () => {
    setorderloading(true)
  const shippingAddress = {
    firstName: form.firstName,
    companyName: form.companyName,
    streetAddress: form.streetAddress,
    apartment: form.apartment,
    city: form.city,
    phone: form.phone,
    email: form.email,
    saveInfo: form.saveInfo,
  };

  const products = cart.map((item) => ({
    productId: item.product._id,
    name: item.product.name,
    image: item.product.image.url,
    quantity: item.quantity,
    selectedColor: item.selectedColor,
    selectedSize: item.selectedSize,
    price: item.product.onSale ? item.product.discountedPrice : item.product.originalPrice,
  }));

  const response = await fetch("/api/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      shippingAddress,
      products,
      subtotal: orderSummary.subtotal,
      shippingFee: 0,
      total: orderSummary.total,
      userEmail: user.email
    }),
  });

  const data = await response.json();
  if (data.success) {
    setShowPopup(true); 
  } else {
    alert("Something went wrong: " + data.message);
  }
  setorderloading(false)
};



useEffect(() => {
  const subtotal = cart?.reduce((total, item) => {
  const price = item.product.onSale ? item.product.discountedPrice : item.product.originalPrice;
  return total + price * item.quantity;
}, 0);
  const shippingFee = 0;
  const total = subtotal + shippingFee;

  setOrderSummary({ subtotal, shippingFee, total });
}, [cart]);


const handlePopupClose = () => {
  setShowPopup(false);
  router.push("/store");
};


  return (
    <>
    {showPopup && <OrderSuccessPopup onClose={handlePopupClose} />}
    <Navbar/>
    <div className='mt-8'>
        <h2 className="text-2xl max-w-[85%]  mx-auto font-semibold my-4">Billing Details</h2>
    <div className="max-w-[85%] mx-auto  grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Billing Details */}
      <div>
        <div className="space-y-4">
          <input type="text" name="firstName" placeholder="First Name*" value={form.firstName} onChange={handleChange} className="w-full border p-2 rounded" />
          <input type="text" name="companyName" placeholder="Company Name" value={form.companyName} onChange={handleChange} className="w-full border p-2 rounded" />
          <input type="text" name="streetAddress" placeholder="Street Address*" value={form.streetAddress} onChange={handleChange} className="w-full border p-2 rounded" />
          <input type="text" name="apartment" placeholder="Apartment, floor, etc. (optional)" value={form.apartment} onChange={handleChange} className="w-full border p-2 rounded" />
          <input type="text" name="city" placeholder="Town/City*" value={form.city} onChange={handleChange} className="w-full border p-2 rounded" />
          <input type="text" name="country" placeholder="Country*" value={form.country} onChange={handleChange} className="w-full border p-2 rounded" />
          <input type="text" name="phone" placeholder="Phone Number*" value={form.phone} onChange={handleChange} className="w-full border p-2 rounded" />
          <input type="email" name="email" placeholder="Email Address*" value={form.email} onChange={handleChange} className="w-full border p-2 rounded" />
          
        </div>
      </div>

      {/* Order Summary */}
      <div className="border p-4 rounded space-y-6">
        {
  cart?.map((cart) => {
    return (
      <div key={cart._id} className="flex flex-col gap-2 border-b pb-4 mb-4">
        <div className="flex items-center gap-4">
          <img
            src={cart.product.image.url}
            alt={cart.product.name}
            className="w-12 h-12 object-cover"
          />
          <div className="flex-1">{cart.product.name}</div>
          <div>
  {new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
  }).format(
    (cart.product.onSale
      ? Number(cart.product.discountedPrice)
      : Number(cart.product.originalPrice)) * Number(cart.quantity)
  )}
</div>

        </div>
        <div className="pl-16 text-sm text-gray-600 space-y-1">
          <p>Quantity: {cart.quantity}</p>
          <p>Color: {cart.selectedColor}</p>
          <p>Size: {cart.selectedSize}</p>
        </div>
      </div>
    );
  })
}

        
        <div className="border-t pt-4 space-y-2">
  <div className="border-t pt-4 space-y-2">
  <div className="flex justify-between">
    <span>Subtotal:</span>
     <span>
  Rs.{" "}
  {new Intl.NumberFormat("en-US").format(Number(orderSummary.subtotal))}
</span>
  </div>
  <div className="flex justify-between">
    <span>Shipping:</span>
    <span>{orderSummary.shippingFee === 0 ? 'Free' : `$${orderSummary.shippingFee}`}</span>
  </div>
  <div className="flex justify-between font-semibold">
    <span>Total:</span>
   <span>
  Rs.{" "}
  {new Intl.NumberFormat("en-US").format(Number(orderSummary.total))}
</span>
  </div>
</div>

</div>

        <div className="space-y-2">
          
          <label className="flex items-center gap-2">
            <input type="radio" name="paymentMethod" value="COD" checked={form.paymentMethod === 'COD'} onChange={handleChange} />
            Cash on delivery
          </label>
        </div>
        
        <button
        onClick={handlePlaceOrder}
         className="bg-red-500 w-full text-white flex justify-center items-center p-2 rounded">{orderloading ? <MiniSpinner/> : 'Place Order'}</button>
      </div>
    </div>
    </div>
    </>
  );
}
