import { connectDb } from "@/lib/db";
import { Order } from "@/models/order";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDb();

  const { orderId, status } = await req.json();

  console.log("Updating order:", orderId, "to status:", status);

  // Validate input
  if (!orderId || !status) {
    return NextResponse.json(
      { error: "Order ID and status are required" },
      { status: 400 }
    );
  }

  // Find and update the order
  const result = await Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true } // return updated document
  );

  if (!result) {
    return NextResponse.json(
      { error: "Order not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ message: "Order updated", order: result });
}
