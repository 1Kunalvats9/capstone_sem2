import { connectToMongoDb } from "@/lib/connectMongoDb";
import User from "@/models/userModel";
import { Bid } from "@/models/userModel";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectToMongoDb();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const bids = await Bid.find({ bidder: user._id })
      .populate({
        path: 'property',
        select: 'title location price currentHighestBid images status'
      })
      .sort({ bidTime: -1 });

    return NextResponse.json({ bids }, { status: 200 });

  } catch (error) {
    console.error("Error fetching user bids:", error);
    return NextResponse.json({ error: "Failed to fetch user bids" }, { status: 500 });
  }
}