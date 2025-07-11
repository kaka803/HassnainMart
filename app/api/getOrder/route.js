import { connectDb } from "@/lib/db";
import { Order } from "@/models/order";
import { NextResponse } from "next/server";



export async function GET(req) {
    await connectDb()
    try {
        const order = await Order.find({}).sort({createdAt: -1})
        if(!order){
            return NextResponse.json({message: 'orders not found'})
        }
        return NextResponse.json({message: 'orders found successfully', order})
    } catch (e) {
        console.log(e);
        
    }
}