import { connectDb } from "@/lib/db";
import { Order } from "@/models/order";
import { OrderEmail } from "@/lib/oderEmail";
import { Cart } from "@/models/cart";
import { Product } from "@/models/product"; // ✅ import product model

export async function POST(req) {
  await connectDb();
  const body = await req.json();

  const {
    shippingAddress,
    products,
    paymentMethod,
    subtotal,
    shippingFee,
    total,
    userEmail,
  } = body;

  if (!shippingAddress || !products || products.length === 0) {
    return Response.json({ success: false, message: "Missing fields" }, { status: 400 });
  }

  // 📨 Send email to user and admin
  await OrderEmail({
    to: userEmail,
    shippingAddress,
    products,
    subtotal,
    shippingFee,
    total,
    isAdmin: false,
  });

  await OrderEmail({
    to: process.env.ADMIN_EMAIL,
    shippingAddress,
    products,
    subtotal,
    shippingFee,
    total,
    isAdmin: true,
  });

  // 🛒 Update stock of each product
  for (const item of products) {
    const product = await Product.findById(item.productId);

    if (product) {
      product.stock = Math.max(0, product.stock - item.quantity); // Ensure stock doesn't go negative
      await product.save();
    }
  }

  // 💾 Create Order
  const newOrder = new Order({
    shippingAddress,
    products,
    paymentMethod,
    isPaid: false,
    subtotal,
    shippingFee,
    total,
    createdBy: userEmail
  });

  await newOrder.save();

  // 🧹 Clear Cart
  const result = await Cart.deleteMany({ userEmail });
  
  if (result) {
    return Response.json({ success: true, message: "Order placed successfully" });
  }
}
