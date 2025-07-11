import { connectDb } from "@/lib/db";
import { Cart } from "@/models/cart";

export async function POST(req) {
  try {
    await connectDb(); // Connect to MongoDB
    

    const { quantity, selectedSize, selectedColor, productID, email } = await req.json();
    console.log('user email',email);

    if (!quantity) {
  return Response.json({ success: false, message: "All fields are required." }, { status: 400 });
}

    // Check if item already exists in cart
    const existingCartItem = await Cart.findOne({
      userEmail: email,
      productID,
      selectedSize,
      selectedColor
    });
    
    

    if (existingCartItem) {
      // Update quantity if exists
      existingCartItem.quantity += quantity;
      await existingCartItem.save();

      return Response.json({ success: true, message: "Cart updated", data: existingCartItem }, { status: 200 });
    }

    // Else, create new cart item
    const newCartItem = await Cart.create({
      userEmail: email,
      productID,
      quantity,
      selectedSize,
      selectedColor
    });

    return Response.json({ success: true, message: "Added to cart", data: newCartItem }, { status: 201 });
  } catch (error) {
    console.error("Cart error:", error);
    return Response.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
