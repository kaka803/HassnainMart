import { connectDb } from "@/lib/db"
import { User } from "@/models/user"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(req) {
  await connectDb()

  try {
    const { formData } = await req.json()
    const {
      firstName,
      email,
      address,
      currentPassword,
      newPassword,
      confirmPassword,
    } = formData

    // Validate input
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const user = await User.findOne({ email })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // ✅ If user wants to change password
    if (newPassword || confirmPassword || currentPassword) {
      if (!currentPassword || !newPassword || !confirmPassword) {
        return NextResponse.json(
          { error: "Please fill all password fields" },
          { status: 400 }
        )
      }

      const isPasswordCorrect = await bcrypt.compare(
        currentPassword,
        user.password
      )

      if (!isPasswordCorrect) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 401 }
        )
      }

      if (newPassword !== confirmPassword) {
        return NextResponse.json(
          { error: "New passwords do not match" },
          { status: 400 }
        )
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10)
      user.password = hashedPassword
    }

    // ✅ Update name and address
    if (firstName) user.name = firstName
    if (address) user.address = address

    await user.save()

    return NextResponse.json(
      {
        message: "Profile updated successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          address: user.address,
          password: newPassword
        },
      },
      { status: 200 }
    )
  } catch (err) {
    console.error("Update profile error:", err)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
