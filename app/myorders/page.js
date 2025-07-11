'use client';

import { useEffect, useState } from "react";
import { SyncLoader } from "react-spinners";
import { useAuthContext } from "../context/authContext";
import Navbar from "../components/navbar";
import { useRouter } from "next/navigation";
import { useCartContext } from '../context/cartContext';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authLoading, user, fetchUser } = useAuthContext();
  const { fetchCart, cart, updateCartQuantity } = useCartContext()
          const [cartQuantity, setcartQuantity] = useState(0)
  const router = useRouter()

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user?.email) fetchOrders();
  }, [user]);
   useEffect(() => {
      const totalQuantity = cart?.reduce(
    (total, item) => total + item.quantity,
    0
      )
      setcartQuantity(totalQuantity)
    }, [cart])

  const fetchOrders = async () => {
    setLoading(true);
    const res = await fetch('api/getOrder');
    const data = await res.json();
    if (data?.order) setOrders(data.order);
    setLoading(false);
  };

  const filteredOrders = orders.filter((order) => order.createdBy === user?.email);

  if (loading || authLoading) {
    return (
      <div className="w-full h-[80vh] flex justify-center items-center">
        <SyncLoader color="#DB4444" />
      </div>
    );
  }

  if (filteredOrders.length === 0) {
    return <div className="text-center py-10 text-gray-600">No orders found.</div>;
  }
 

  return (
    <>
    <Navbar
        cartQuantity={cartQuantity ? cartQuantity : 0}
        />
    <div className="max-w-[90%] mx-auto mt-10">
      <h2 className="text-xl font-bold mb-6">My Orders</h2>

      {/* ✅ Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="py-3 px-4 text-left">#</th>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-left">Total</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Products</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((o, index) => (
  <tr
    key={o._id}
    onClick={() => router.push(`/order/${o._id}`)}
    className="border-b hover:bg-gray-50 cursor-pointer"
  >
    <td className="py-2 px-4">#{index + 1}</td>
    <td className="py-2 px-4">{new Date(o.createdAt).toLocaleDateString()}</td>
    <td className="py-2 px-4">
      Rs. {new Intl.NumberFormat('en-US').format(o.total)}
    </td>
    <td className="py-2 px-4">
      <span
        className={`px-2 py-1 text-xs rounded-full font-medium
        ${o.status === 'Delivered'
          ? 'bg-green-100 text-green-700'
          : o.status === 'Pending'
          ? 'bg-yellow-100 text-yellow-700'
          : o.status === 'Processing'
          ? 'bg-blue-100 text-blue-700'
          : o.status === 'Shipped'
          ? 'bg-purple-100 text-purple-700'
          : o.status === 'Cancelled'
          ? 'bg-red-100 text-red-700'
          : 'bg-gray-100 text-gray-700'}`}
      >
        {o.status}
      </span>
    </td>
    <td className="py-2 px-4">
      <div className="flex gap-2 flex-wrap">
        {o.products.map((p, idx) => (
          <img
            key={idx}
            src={p.image || "/placeholder.png"}
            alt={`Product ${idx + 1}`}
            className="w-10 h-10 object-cover rounded border"
          />
        ))}
      </div>
    </td>
  </tr>
))}

          </tbody>
        </table>
      </div>

      {/* ✅ Mobile Card View */}
      <div className="block md:hidden space-y-4">
        {filteredOrders.map((o, index) => (
          <div onClick={() => router.push(`/order/${o._id}`)} key={o._id} className="bg-white rounded-xl shadow p-4 text-sm space-y-2">
            <div className="flex items-center justify-between">
              <p className="font-medium">Order #{index + 1}</p>
              <span className={`text-xs px-2 py-1 rounded-full
                ${o.status === 'Delivered'
                  ? 'bg-green-100 text-green-700'
                  : o.status === 'Pending'
                  ? 'bg-yellow-100 text-yellow-700'
                  : o.status === 'Processing'
                  ? 'bg-blue-100 text-blue-700'
                  : o.status === 'Shipped'
                  ? 'bg-purple-100 text-purple-700'
                  : o.status === 'Cancelled'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-700'
                }`}>
                {o.status}
              </span>
            </div>

            <p className="text-gray-600">Date: {new Date(o.createdAt).toLocaleDateString()}</p>
            <p className="text-gray-600">Total: Rs. {new Intl.NumberFormat('en-US').format(o.total)}</p>

            {/* All product images */}
            <div className="flex items-center gap-2 flex-wrap mt-2">
              {o.products.map((p, idx) => (
                <img
                  key={idx}
                  src={p.image || "/placeholder.png"}
                  alt={`Product ${idx + 1}`}
                  className="w-12 h-12 object-cover rounded border"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
