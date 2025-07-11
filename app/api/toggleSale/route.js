import { connectDb } from "@/lib/db";
import { Product } from "@/models/product";
import { NextResponse } from "next/server";

export async function PUT(req) {
  await connectDb();
  const { productId } = await req.json();

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    product.onSale = !product.onSale;
    await product.save();

    return NextResponse.json({ success: true, updated: product });
  } catch (err) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
