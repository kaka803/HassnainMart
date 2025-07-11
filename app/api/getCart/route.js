import { Cart } from "@/models/cart";
import { Product } from "@/models/product";
import { connectDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDb();

  try {
    // 👇 Get userId from query params (or headers/body depending on your logic)
    const email = await req.json()
    const userEmail = email.email

    console.log('user email' , email);
    
    
    

    if (!email) {
      return NextResponse.json({ error: "email is required" }, { status: 400 });
    }

    // 👇 Get all cart items for the user
    const cart = await Cart.find({ userEmail }).sort({ createdAt: -1 });

    if (!cart || cart.length === 0) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    // 👇 Extract all product IDs from cart
    const productIDs = cart.map((item) => item.productID);

    // 👇 Find all product details
    const products = await Product.find({ _id: { $in: productIDs } });

    // 👇 Attach product details to each cart item
    const cartWithProductDetails = cart.map((cartItem) => {
      const product = products.find(
        (prod) => prod._id.toString() === cartItem.productID.toString()
      );
      return {
        ...cartItem.toObject(),
        product,
      };
    });

    return NextResponse.json({
      message: "Cart found successfully",
      cart: cartWithProductDetails,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
