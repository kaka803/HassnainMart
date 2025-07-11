import { connectDb } from "@/lib/db";
import { Order } from "@/models/order";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  await connectDb();

  const { id } = params;

  try {
    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
