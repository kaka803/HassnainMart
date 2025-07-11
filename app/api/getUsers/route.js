import { User } from "@/models/user";
import { connectDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
    await connectDb()
    try {
        const users = await User.find({}).sort({ createdAt: -1 })
        if (!users) {
            return NextResponse.json({ error: 'users not found' })

        }
        return NextResponse.json({ message: 'users found successfully', users })
    } catch (e) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });

    }
}