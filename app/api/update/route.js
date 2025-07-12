import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { Cart } from "@/models/cart";

export async function PUT(req) {
  await connectDb();

  const { userEmail, productId, quantity } = await req.json();   

  console.log('cart data',userEmail, productId, quantity);
  

  try {
    const updatedCart = await Cart.findOneAndUpdate(
      {
        userEmail,               
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
