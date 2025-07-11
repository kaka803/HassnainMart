'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { SyncLoader } from 'react-spinners';
import Navbar from '@/app/components/navbar';
import { useAuthContext } from '@/app/context/authContext';
import { useCartContext } from '@/app/context/cartContext';

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
    const { authLoading, user, fetchUser } = useAuthContext();
      const { fetchCart, cart, updateCartQuantity } = useCartContext()
              const [cartQuantity, setcartQuantity] = useState(0)
  useEffect(() => {
    fetchUser();
  }, []);
   useEffect(() => {
      const totalQuantity = cart?.reduce(
    (total, item) => total + item.quantity,
    0
      )
      setcartQuantity(totalQuantity)
    }, [cart])
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orderdetail/${id}`);
        const data = await res.json();
        setOrder(data.order);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="w-full h-[80vh] flex justify-center items-center">
        <SyncLoader color="#DB4444" />
      </div>
    );
  }

  if (!order) {
    return <div className="text-center py-10 text-gray-600">Order not found.</div>;
  }

  return (
    <>
    <Navbar
            cartQuantity={cartQuantity ? cartQuantity : 0}
            />
    <div className="max-w-[90%] mx-auto mt-10 space-y-6">
      <h2 className="text-2xl font-bold">Order Details</h2>

      {/* Order Summary */}
      <div className="bg-white shadow rounded-xl p-6">
        <p><strong>Order ID:</strong> {order._id}</p>
        <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
        <p><strong>Status:</strong> <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">{order.status}</span></p>
        <p><strong>Payment:</strong> {order.paymentMethod} {order.isPaid ? "(Paid)" : "(Unpaid)"}</p>
        <p><strong>Total:</strong> Rs. {new Intl.NumberFormat('en-US').format(order.total)}</p>
      </div>

      {/* Shipping Info */}
      <div className="bg-white shadow rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-2">Shipping Information</h3>
        <p><strong>Name:</strong> {order.shippingAddress.firstName}</p>
        <p><strong>Company:</strong> {order.shippingAddress.companyName}</p>
        <p><strong>Address:</strong> {order.shippingAddress.streetAddress}, {order.shippingAddress.apartment}, {order.shippingAddress.city}</p>
        <p><strong>Phone:</strong> {order.shippingAddress.phone}</p>
        <p><strong>Email:</strong> {order.shippingAddress.email}</p>
      </div>

      {/* Product List */}
      <div className="bg-white shadow rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Ordered Products</h3>
        <div className="space-y-4">
          {order.products.map((product) => (
            <div key={product._id} className="flex items-center gap-4 border-b pb-4">
              <img
                src={product.image || "/placeholder.png"}
                alt={product.name}
                className="w-20 h-20 object-cover rounded border"
              />
              <div>
                <p className="font-semibold">{product.name}</p>
                <p className="text-sm text-gray-600">Qty: {product.quantity}</p>
                <p className="text-sm text-gray-600">Color: {product.selectedColor}</p>
                <p className="text-sm text-gray-600">Size: {product.selectedSize}</p>
                <p className="text-sm text-gray-800 font-medium">Price: Rs. {new Intl.NumberFormat('en-US').format(product.price)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
}
