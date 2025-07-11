import { Product } from "@/models/product";
import { connectDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
    await connectDb()
    try {
        const products = await Product.find({}).sort({ createdAt: -1 })
        if(!products){
            return NextResponse.json({error: 'products not found'})

        }
        return NextResponse.json({message: 'product found successfully', products})
    } catch (e) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
        
    }
}