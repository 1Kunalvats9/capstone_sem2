import { connectToMongoDb } from "@/lib/connectMongoDb";
import { Property, Bid } from "@/models/userModel";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectToMongoDb();
    const { id } = params;

    const bids = await Bid.find({ property: id })
      .populate('bidder', 'userName email')
      .sort({ bidTime: -1 });

    return NextResponse.json({ bids }, { status: 200 });

  } catch (error) {
    console.error("Error fetching bids:", error);
    return NextResponse.json({ error: "Failed to fetch bids" }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  try {
    await connectToMongoDb();
    const { id } = params;
    const { email, bidAmount } = await req.json();

    if (!email || !bidAmount || bidAmount <= 0) {
      return NextResponse.json({ error: "Invalid bid data" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const property = await Property.findById(id);
    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    if (!property.isBiddingActive) {
      return NextResponse.json({ error: "Bidding is not active for this property" }, { status: 400 });
    }

    if (property.biddingEndsAt && new Date() > property.biddingEndsAt) {
      return NextResponse.json({ error: "Bidding has ended for this property" }, { status: 400 });
    }

    if (bidAmount <= property.currentHighestBid) {
      return NextResponse.json({ 
        error: `Bid must be higher than current highest bid of $${property.currentHighestBid}` 
      }, { status: 400 });
    }

    const newBid = new Bid({
      property: id,
      bidder: user._id,
      bidAmount
    });

    await newBid.save();

    property.currentHighestBid = bidAmount;
    property.highestBidder = user._id;
    await property.save();

    user.bidsMade.push(newBid._id);
    await user.save();

    const populatedBid = await Bid.findById(newBid._id)
      .populate('bidder', 'userName email');

    return NextResponse.json({ 
      message: "Bid placed successfully", 
      bid: populatedBid,
      newHighestBid: bidAmount
    }, { status: 201 });

  } catch (error) {
    console.error("Error placing bid:", error);
    return NextResponse.json({ error: "Failed to place bid" }, { status: 500 });
  }
}