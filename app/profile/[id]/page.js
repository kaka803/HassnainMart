'use client'
import { useEffect, useState } from 'react'
import { useAuthContext } from '@/app/context/authContext'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import MiniSpinner from '@/app/components/loading'
import { SyncLoader } from 'react-spinners'
export default function Page() {
  const { authLoading, user, fetchUser } = useAuthContext()
  const [updateloading, setupdateloading] = useState(false)
  const params = useParams()
  const id = params?.id

  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    address: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  useEffect(() => {
    fetchUser()
  }, [])

  useEffect(() => {
    if (user) {
        console.log(user);
        
      setFormData((prev) => ({
        ...prev,
        firstName: user.name || '',
        email: user.email || '',
        address: user.address || '',
      }))
    }
  }, [user])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }
  const router = useRouter()

  const handleSubmit = async (e) => {
    setupdateloading(true)
    e.preventDefault()
    const res = await fetch('/api/updateprofile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ formData }),
    })

    const data = await res.json()
    setupdateloading(false)
    if(data.error){
        alert(data.error)
    }
    if (data) {
      console.log(data)
      localStorage.removeItem('token')
      alert('Again Login')
      router.push('/login')
    }
  }

  return (
    <section className="max-w-[85%] mx-auto py-10">
      <div className=" rounded-xl p-8 w-full">
        <h2 className="text-xl font-semibold text-red-600 mb-6">Edit Your Profile</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name (read-only) */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Name</label>
            <input
              name="firstName"
              type="text"
              value={formData.firstName}
              readOnly
              className="w-full bg-gray-100 cursor-not-allowed text-gray-500 border border-gray-300 rounded-md px-4 py-2 text-sm"
            />
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              readOnly
              className="w-full bg-gray-100 cursor-not-allowed text-gray-500 border border-gray-300 rounded-md px-4 py-2 text-sm"
            />
          </div>

          {/* Address (editable) */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Address</label>
            <input
              name="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
              placeholder="Your Address"
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>

          {/* Empty div for grid balance */}
          <div></div>

          {/* Password Section */}
          <div className="col-span-1 md:col-span-2 mt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Password Changes</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                name="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Current Password"
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
              />
              <input
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="New Password"
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
              />
              <input
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm New Password"
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="col-span-1 md:col-span-2 flex justify-end gap-4 mt-6">
            <button
              type="button"
              className="text-sm text-gray-600 hover:text-red-500 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-red-600 text-white text-sm px-6 py-2 rounded-md hover:bg-red-700 transition"
            >
              {updateloading ? <MiniSpinner/> : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
