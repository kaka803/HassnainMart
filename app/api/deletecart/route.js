// app/api/deleteCart/route.js

import { NextResponse } from 'next/server';
import { connectDb } from '@/lib/db'; 
import { Cart } from '@/models/cart'; 

export async function POST(req) {
  try {
    const body = await req.json();
    const { id } = body;
    const _id = id

    if (!id ) {
      return NextResponse.json({ success: false, message: "Missing userId or productId" }, { status: 400 });
    }

    await connectDb(); // ✅ Ensure DB is connected

    // Delete the cart item based on userId and productId
    const result = await Cart.findOneAndDelete({
      _id
    });

    if (!result) {
      return NextResponse.json({ success: false, message: "Cart item not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Item deleted successfully" });
    
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
