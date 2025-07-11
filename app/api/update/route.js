import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { Cart } from "@/models/cart";

export async function PUT(req) {
  await connectDb();

  const { userId, productId, quantity } = await req.json();   

  try {
    const updatedCart = await Cart.findOneAndUpdate(
      {
        userId,               
        productID: productId  
      },
      { $set: { quantity } }, 
      { new: true }
    );

    if (!updatedCart) {
      return NextResponse.json(
        { success: false, message: "Cart item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, cart: updatedCart });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error updating cart", error: error.message },
      { status: 500 }
    );
  }
}
