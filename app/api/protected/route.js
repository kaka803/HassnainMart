import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";


export async function GET(req) {
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return NextResponse.json({ message: "Protected data accessed", user: decoded });
  } catch (error) {
    console.error("Protected Route Error:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}