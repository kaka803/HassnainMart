import { Product } from "@/models/product";
import { connectDb } from "@/lib/db";
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { generateSKU } from "@/lib/generatesku";




export async function POST(req) {
  try {
    await connectDb();
    const { name, description, category, brand, originalPrice, discountedPrice, stock, tags, color, size, width, height, weight, delivery, onSale, saleEndDate, image } = await req.json();


    

    

    // Upload to Cloudinary
    const uploadRes = await cloudinary.uploader.upload(image, {
      folder: "products",
    });

    // Save to DB
    const newProduct = new Product({
  name,
  description,
  category,
  brand,
  originalPrice,
  discountedPrice,
  stock,
  sku: generateSKU(name), 
  tags: tags,
  color: color,
  size: size,
  dimensions: {
    width,
    height,
    weight
  },
  estimatedDelivery: delivery,
  onSale,
  saleEndDate,
  image: {
        url: uploadRes.secure_url,
        public_id: uploadRes.public_id,
      }
});


    await newProduct.save();

    return NextResponse.json({ message: "product added successfully", product: newProduct }, { status: 201 });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
