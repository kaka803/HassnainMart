'use client';

import { useState, useEffect } from 'react';
import { useProductContext } from '../context/productcontext';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';


import {
  Menu,
  Home,
  Users,
  Package,
  ShoppingCart,
  BarChart3,
  Percent,
  Plus,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const salesData = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 5000 },
  { name: 'Apr', sales: 4000 },
  { name: 'May', sales: 6000 },
];



export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');
  const {products, setProducts} = useProductContext()
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [salesData, setSalesData] = useState([]);
    const [loading, setloading] = useState(false)
    const [status, setStatus] = useState('');
    const [statusLoading, setStatusLoading] = useState(null); 

    const [productData, setProductData] = useState({
      name: "",
      description: "",
      category: "",
      brand: "",
      originalPrice: "",
      discountedPrice: "",
      stock: "",
      tags: "",
      color: "",
      size: "",
      width: "",
      height: "",
      weight: "",
      delivery: "",
      onSale: "false",
      saleEndDate: "",
      image: ''
    });

    const [admintoken, setadmintoken] = useState('')
    const router = useRouter()
  

    useEffect(() => {
      
    const token = localStorage.getItem('admintoken')
    setadmintoken(token)
      if(!token){
        router.push('/adminlogin')
      }
    }, [])
    
    const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });
  
    // Handle input changes
    const handleChange = async (e) => {
    const { name, type, files, value } = e.target;
  
    if (type === "file") {
      const file = files[0]; // take first file only
      const base64 = await convertToBase64(file);
      setProductData({ ...productData, image: base64 });
    } else {
      setProductData({ ...productData, [name]: value });
    }
  };




  
  useEffect(() => {
    
    fethcOrder()
  }, [users])
  useEffect(() => {
    
    fethcUser()
  }, [])
const fethcOrder = async () => {
      
      const res = await fetch('api/getOrder')
      const data = await res.json()
      if(data) {
        setOrders(data.order)
        
        
      }
    }
    const fethcUser = async () => {
      
      const res = await fetch('api/getUsers')
      const data = await res.json()
      if(data) {
        setUsers(data.users)
        
        
      }
    }

    

  function formatReadableDate(dateString) {
  const date = new Date(dateString);

  // Convert to Pakistan time (UTC+5)
  const options = {
    timeZone: 'Asia/Karachi',
    day: 'numeric',
    month: 'long', // use 'short' for "Jul"
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };

  return new Intl.DateTimeFormat('en-GB', options).format(date);
}


function calculateWeeklySales(orders) {
  const weeklySalesMap = {};

  orders.forEach((order) => {
    if (order.status !== "Delivered") return; // ✅ Only delivered orders

    const date = new Date(order.createdAt);
    const oneJan = new Date(date.getFullYear(), 0, 1);
    const numberOfDays = Math.floor((date - oneJan) / (24 * 60 * 60 * 1000));
    const week = Math.ceil((date.getDay() + 1 + numberOfDays) / 7);

    const key = `Week ${week}`;

    if (!weeklySalesMap[key]) {
      weeklySalesMap[key] = 0;
    }
    weeklySalesMap[key] += order.total;
  });

  const chartData = Object.entries(weeklySalesMap).map(([week, sales]) => ({
    name: week,
    sales,
  }));

  return chartData;
}



useEffect(() => {
  const data = calculateWeeklySales(orders);
  setSalesData(data);
}, [orders]);



const handleSubmit = async (e) => {
    setloading(true)
    e.preventDefault();

    

    const res = await fetch("/api/addproduct", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: productData.name,
      description: productData.description,
      category: productData.category,
      brand: productData.brand,
      originalPrice: productData.originalPrice,
      discountedPrice: productData.discountedPrice,
      stock: productData.stock,
      tags: productData.tags,
      color: productData.color,
      size: productData.size,
      width: productData.width,
      height: productData.height,
      weight: productData.weight,
      delivery: productData.delivery,
      onSale: productData.onSale,
      saleEndDate: productData.saleEndDate,
      color: productData.color,
      image: productData.image
    }),
  });
    const Data = await res.json();
    setloading(false)
    if(Data){
      alert('product added successfully')
      setProductData({
  name: "",
  description: "",
  category: "",
  brand: "",
  originalPrice: "",
  discountedPrice: "",
  stock: "",
  tags: "",
  color: "",
  size: "",
  width: "",
  height: "",
  weight: "",
  delivery: "",
  onSale: "false",
  saleEndDate: "",
  image: ""
});

    }
    
  };


  const toggleSale = async (productId) => {
  try {
    const res = await fetch('/api/toggleSale', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    });

    const data = await res.json();

    if (data.success) {
      // Update local state if needed
      setProducts(prev =>
        prev.map(p =>
          p._id === productId ? { ...p, onSale: data.updated.onSale } : p
        )
      );
    }
  } catch (err) {
    console.error("Failed to toggle sale status:", err);
  }
};


const handleStatusChange = async (orderId, newStatus) => {
  console.log(orderId);
  
  try {
    setStatusLoading(orderId); // show loading for this order

    const res = await fetch('/api/updateOrderStatus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, status: newStatus }),
    });

    const data = await res.json();

    if (res.ok) {
      // update local orders state
      console.log(data);
      
      setOrders(prev =>
  prev.map(order =>
    order._id === orderId ? { ...order, status: newStatus } : order
  )
)
    } else {
      alert('Failed to update status');
    }
  } catch (error) {
    console.error("Status update failed", error);
  } finally {
    setStatusLoading(null); 
  }
};

  
  return (
    <div className="flex h-screen overflow-hidden font-sans">
      {/* Sidebar */}
      <div
        className={`fixed lg:static z-40 w-64 bg-white shadow-md h-full transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 font-bold text-xl border-b">Admin Panel</div>
        <nav className="p-4 space-y-3 text-gray-800">
         <button
  onClick={() => setActivePage('dashboard')}
  className={`flex items-center gap-2 px-4 py-2 w-full text-left rounded-lg transition-all duration-200 ${
    activePage === 'dashboard'
      ? 'bg-gray-200 text-gray-800 shadow-sm font-semibold'
      : 'hover:bg-gray-100 text-gray-800'
  }`}
>
  <Home size={18} /> Dashboard
</button>

<button
  onClick={() => setActivePage('products')}
  className={`flex items-center gap-2 px-4 py-2 w-full text-left rounded-lg transition-all duration-200 ${
    activePage === 'products'
      ? 'bg-gray-200 text-gray-800 shadow-sm font-semibold'
      : 'hover:bg-gray-100 text-gray-800'
  }`}
>
  <Package size={18} /> Products
</button>

<button
  onClick={() => setActivePage('users')}
  className={`flex items-center gap-2 px-4 py-2 w-full text-left rounded-lg transition-all duration-200 ${
    activePage === 'users'
      ? 'bg-gray-200 text-gray-800 shadow-sm font-semibold'
      : 'hover:bg-gray-100 text-gray-800'
  }`}
>
  <Users size={18} /> Users
</button>

<button
  onClick={() => setActivePage('orders')}
  className={`flex items-center gap-2 px-4 py-2 w-full text-left rounded-lg transition-all duration-200 ${
    activePage === 'orders'
      ? 'bg-gray-200 text-gray-800 shadow-sm font-semibold'
      : 'hover:bg-gray-100 text-gray-800'
  }`}
>
  <ShoppingCart size={18} /> Orders
</button>
<button
  onClick={() => setActivePage('add-product')}
  className={`flex items-center gap-2 px-4 py-2 w-full text-left rounded-lg transition-all duration-200 ${
    activePage === 'add-product'
      ? 'bg-gray-200 text-gray-800 shadow-sm font-semibold'
      : 'hover:bg-gray-100 text-gray-800'
  }`}
>
  <ShoppingCart size={18} /> Add product
</button>


        </nav>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Topbar */}
        <header className="flex items-center justify-between px-4 py-5 sticky top-0 z-20 bg-white border-b">
  {/* Menu Button for Mobile */}
  <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden">
    <Menu size={24} />
  </button>

  {/* Page Title */}
  <h1 className="text-lg font-semibold capitalize">{activePage}</h1>

  {/* Logout Button */}
  <button
    onClick={() => {
      localStorage.removeItem('admintoken'); // or 'token'
      window.location.href = '/adminlogin'; // redirect to login page
    }}
    className="bg-red-500 text-white text-sm px-4 py-2 rounded hover:bg-red-600 transition-all"
  >
    Logout
  </button>
</header>


        {/* Pages */}
        <main className="p-6 space-y-8 bg-gray-50 overflow-y-auto">
          {activePage === 'dashboard' && (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 shadow">
                  <p className="text-gray-500 text-sm">Users</p>
                  <p className="text-2xl font-bold">{users.length}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow">
                  <p className="text-gray-500 text-sm">Orders</p>
                  <p className="text-2xl font-bold">{orders.length}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow">
                  <p className="text-gray-500 text-sm">Products</p>
                  <p className="text-2xl font-bold">{products.length}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow">
                  <p className="text-gray-500 text-sm">Sales</p>
                  <p className="text-2xl font-bold">
                    Rs. {new Intl.NumberFormat('en-US').format(salesData.reduce((total, item) => total + item.sales, 0))}
</p>
                </div>
              </div>

              {/* Chart */}
              <div className="bg-white rounded-xl p-6 shadow">
                <div className="flex items-center gap-2 mb-4 text-gray-700 font-semibold">
                  <BarChart3 size={20} /> Monthly Sales
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={salesData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="sales" stroke="#db4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          )}

          {activePage === 'products' && (
            <div>
              <h2 className="text-xl font-bold mb-4">All Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product._id} className="bg-white p-4 rounded-xl shadow flex flex-col justify-between">
                    <img
                      src={product.image.url}
                      alt={product.name}
                      className="w-[20%] object-cover rounded-md mb-4"
                    />
                    <div className="mb-2">
                      <h3 className="text-lg font-semibold">{product.name}</h3>
                      <p className="text-gray-600 text-sm">Rs. {new Intl.NumberFormat('en-US').format(product.originalPrice)}</p>
                    </div>
                    <button
                      onClick={() => toggleSale(product._id)}
                      className={`mt-auto py-1.5 px-3 rounded-md text-sm font-medium flex items-center gap-2 ${
                        product.onSale
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Percent size={16} />
                      {product.onSale ? 'On Sale' : 'Add Sale'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activePage === 'users' && (
  <div>
    <h2 className="text-xl font-bold mb-4 text-gray-800">All Users</h2>

    {/* Desktop Table View */}
    <div className="hidden md:block overflow-x-auto">
      <table className="min-w-full text-sm bg-white rounded-xl shadow border border-gray-100">
        <thead className="text-gray-600 border-b bg-gray-50">
          <tr>
            <th className="py-3 px-4 text-left whitespace-nowrap">#</th>
            <th className="py-3 px-4 text-left whitespace-nowrap">Name</th>
            <th className="py-3 px-4 text-left whitespace-nowrap">Email</th>
            <th className="py-3 px-4 text-left whitespace-nowrap">Role</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((u, i) => (
            <tr key={u._id} className="border-b hover:bg-gray-50">
              <td className="py-3 px-4 whitespace-nowrap text-gray-700">{i + 1}</td>
              <td className="py-3 px-4 whitespace-nowrap text-gray-800">{u.name}</td>
              <td className="py-3 px-4 whitespace-nowrap text-gray-600">{u.email}</td>
              <td className="py-3 px-4 whitespace-nowrap">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                  Customer
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Mobile Card View */}
    <div className="block md:hidden space-y-4">
      {users?.map((u, i) => (
        <div key={u._id} className="bg-white rounded-xl shadow px-4 py-3 space-y-2 text-sm border border-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">#{i + 1}</h3>
            <span className="text-xs text-gray-500">{u.role || 'Customer'}</span>
          </div>
          <p>
            <strong className="text-gray-700">Name:</strong>{' '}
            <span className="text-gray-800">{u.name}</span>
          </p>
          <p>
            <strong className="text-gray-700">Email:</strong>{' '}
            <span className="text-gray-600">{u.email}</span>
          </p>
        </div>
      ))}
    </div>
  </div>
)}

{activePage === 'orders' && (
  <div>
    <h2 className="text-xl font-bold mb-4">All Orders</h2>
    <div className="w-full overflow-x-auto">
  {/* Desktop Table (Hidden on small screens) */}
<div className="hidden md:block overflow-x-auto">
  <table className="min-w-full text-left text-sm bg-white rounded-xl shadow">
    <thead className="text-gray-600 border-b bg-gray-100">
      <tr>
        <th className="py-2 px-4 whitespace-nowrap">#</th>
        <th className="py-2 px-4 whitespace-nowrap">Customer</th>
        <th className="py-2 px-4 whitespace-nowrap">Date</th>
        <th className="py-2 px-4 whitespace-nowrap">Total</th>
        <th className="py-2 px-4 whitespace-nowrap">Status</th>
      </tr>
    </thead>
    <tbody>
      {orders.map((o, index) => (
        <tr key={o._id} className="border-b hover:bg-gray-50">
          <td className="py-2 px-4">#{index + 1}</td>
          <td className="py-2 px-4">{o.shippingAddress.firstName}</td>
          <td className="py-2 px-4">{formatReadableDate(o.createdAt)}</td>
          <td className="py-2 px-4">Rs. {new Intl.NumberFormat('en-US').format(o.total)}</td>
          <td className="py-2 px-4">
            <select
              value={o.status}
              onChange={(e) => handleStatusChange(o._id, e.target.value)}
              disabled={statusLoading === o._id}
              className={`px-2 py-1 text-xs font-medium rounded-full
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
                  : 'bg-gray-100 text-gray-700'}
              `}
            >
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

{/* Mobile Card View (Visible only on small screens) */}
<div className="block md:hidden space-y-6">
  {orders.map((o, index) => (
    <div
      key={o._id}
      className="bg-white rounded-2xl shadow-md px-5 py-4 text-sm space-y-3 border border-gray-100"
    >
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-gray-700 text-base">
          Order <span className="text-gray-700">#{index + 1}</span>
        </h3>
        <span className="text-xs text-gray-400">{formatReadableDate(o.createdAt)}</span>
      </div>

      <div className="text-gray-600 space-y-1">
        <p>
          <span className="font-medium text-gray-700">Customer:</span> {o.shippingAddress.firstName}
        </p>
        <p>
          <span className="font-medium text-gray-700">Total:</span> Rs.{" "}
          {new Intl.NumberFormat("en-US").format(o.total)}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <span className="font-medium text-gray-700">Status:</span>
        <select
          value={o.status}
          onChange={(e) => handleStatusChange(o._id, e.target.value)}
          disabled={statusLoading === o._id}
          className={`px-3 py-[6px] text-xs rounded-full font-medium shadow-sm border outline-none transition
            ${
              o.status === "Delivered"
                ? "bg-green-100 text-green-700"
                : o.status === "Pending"
                ? "bg-yellow-100 text-yellow-700"
                : o.status === "Processing"
                ? "bg-blue-100 text-blue-700"
                : o.status === "Shipped"
                ? "bg-purple-100 text-purple-700"
                : o.status === "Cancelled"
                ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-gray-700"
            }
          `}
        >
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {statusLoading === o._id && (
        <p className="text-xs text-gray-400 italic animate-pulse">Updating...</p>
      )}
    </div>
  ))}
</div>


</div>


  </div>
)}





{activePage === 'add-product' && (
  <div>
    <h2 className="text-xl font-bold mb-4">Add New Product</h2>
    <div className="bg-white rounded-xl p-6 shadow max-w-4xl">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          name="name"
          type="text"
          placeholder="Product Name"
          className="w-full p-2 border border-gray-300 rounded"
          value={productData.name}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Product Description"
          className="w-full p-2 border border-gray-300 rounded"
          rows={4}
          value={productData.description}
          onChange={handleChange}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            name="category"
            type="text"
            placeholder="Category"
            className="w-full p-2 border border-gray-300 rounded"
            value={productData.category}
            onChange={handleChange}
          />
          <input
            name="brand"
            type="text"
            placeholder="Brand"
            className="w-full p-2 border border-gray-300 rounded"
            value={productData.brand}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            name="originalPrice"
            type="number"
            placeholder="Original Price"
            className="w-full p-2 border border-gray-300 rounded"
            value={productData.originalPrice}
            onChange={handleChange}
          />
          <input
            name="discountedPrice"
            type="number"
            placeholder="Discounted Price"
            className="w-full p-2 border border-gray-300 rounded"
            value={productData.discountedPrice}
            onChange={handleChange}
          />
        </div>

        <input
          name="stock"
          type="number"
          placeholder="Stock Quantity"
          className="w-full p-2 border border-gray-300 rounded"
          value={productData.stock}
          onChange={handleChange}
        />

        <input
          name="tags"
          type="text"
          placeholder="Tags (comma separated)"
          className="w-full p-2 border border-gray-300 rounded"
          value={productData.tags}
          onChange={handleChange}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            name="color"
            type="text"
            placeholder="Color"
            className="w-full p-2 border border-gray-300 rounded"
            value={productData.color}
            onChange={handleChange}
          />
          <input
            name="size"
            type="text"
            placeholder="Size"
            className="w-full p-2 border border-gray-300 rounded"
            value={productData.size}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            name="width"
            type="text"
            placeholder="Width (cm)"
            className="w-full p-2 border border-gray-300 rounded"
            value={productData.width}
            onChange={handleChange}
          />
          <input
            name="height"
            type="text"
            placeholder="Height (cm)"
            className="w-full p-2 border border-gray-300 rounded"
            value={productData.height}
            onChange={handleChange}
          />
          <input
            name="weight"
            type="text"
            placeholder="Weight (g)"
            className="w-full p-2 border border-gray-300 rounded"
            value={productData.weight}
            onChange={handleChange}
          />
        </div>

        <input
          name="delivery"
          type="text"
          placeholder="Estimated Delivery"
          className="w-full p-2 border border-gray-300 rounded"
          value={productData.delivery}
          onChange={handleChange}
        />

        <div>
          <label className="block text-sm font-medium mb-1">On Sale?</label>
          <select
            name="onSale"
            className="w-full p-2 border border-gray-300 rounded"
            value={productData.onSale}
            onChange={handleChange}
          >
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Sale End Date & Time</label>
          <input
            name="saleEndDate"
            type="datetime-local"
            className="w-full p-2 border border-gray-300 rounded"
            value={productData.saleEndDate}
            onChange={handleChange}
          />
        </div>

        <input
          name="image"
          type="file"
          accept="image/*"
          className="w-full p-2 border border-gray-300 rounded"
          onChange={handleChange}
        />

        <Button
          type="submit"
          disabled={loading}
          className="bg-[rgb(219,68,68)] hover:bg-red-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" /> {loading ? 'Adding...' : 'Add Product'}
        </Button>
      </form>
    </div>
  </div>
)}



        </main>
      </div>
    </div>
  );
}
