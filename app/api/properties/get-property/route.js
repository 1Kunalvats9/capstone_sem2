import { connectToMongoDb } from "@/lib/connectMongoDb";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectToMongoDb();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    } else {
      return NextResponse.json({ data: user.saved?.properties || [] }, { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching saved properties:", error);
    return NextResponse.json({ error: "Failed to fetch saved properties" }, { status: 500 });
  }
}