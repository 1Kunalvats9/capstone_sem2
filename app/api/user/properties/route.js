import { connectToMongoDb } from "@/lib/connectMongoDb";
import User from "@/models/userModel";
import { Property } from "@/models/userModel";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectToMongoDb();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const user = await User.findOne({ email })
      .populate({
        path: 'publishedProperties',
        populate: {
          path: 'highestBidder',
          select: 'userName email'
        }
      });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ properties: user.publishedProperties }, { status: 200 });

  } catch (error) {
    console.error("Error fetching user properties:", error);
    return NextResponse.json({ error: "Failed to fetch user properties" }, { status: 500 });
  }
}