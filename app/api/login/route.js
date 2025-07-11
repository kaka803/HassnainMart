import { connectDb } from "@/lib/db";
import { User } from "@/models/user";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export const POST = async (req) => {
  
    const { email, password } = await req.json();
    await connectDb();
    console.log(email, password);
    

    const user = await User.findOne({ email });
    if (!user) {    
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }  
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return NextResponse.json({ error: 'your password is wrong' }, { status: 401 });
    } 
    if (!user.isVerified) {
        return NextResponse.json({ error: "User not verified" }, { status: 403 });
    }   
    
    const token = jwt.sign({ id: user._id, name: user.name, email: user.email, address: user.address }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return NextResponse.json({ message: "Login successful", token }, { status: 200 });

  }
