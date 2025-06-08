import { connectToMongoDb } from "@/lib/connectMongoDb";
import User from "@/models/userModel";
import { Property } from "@/models/userModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectToMongoDb();
    const { email, propertyId } = await req.json();

    if (!email || !propertyId) {
      return NextResponse.json({ error: "Missing email or property ID" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    const isAlreadySaved = user.savedProperties.includes(propertyId);

    if (isAlreadySaved) {
      user.savedProperties = user.savedProperties.filter(id => id.toString() !== propertyId);
      await user.save();
      return NextResponse.json({ message: "Property removed from saved list" }, { status: 200 });
    } else {
      user.savedProperties.push(propertyId);
      await user.save();
      return NextResponse.json({ message: "Property saved successfully" }, { status: 200 });
    }

  } catch (error) {
    console.error("Error saving/unsaving property:", error);
    return NextResponse.json({ error: "Failed to save/unsave property" }, { status: 500 });
  }
}

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
        path: 'savedProperties',
        populate: {
          path: 'owner',
          select: 'userName email'
        }
      });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ savedProperties: user.savedProperties }, { status: 200 });

  } catch (error) {
    console.error("Error fetching saved properties:", error);
    return NextResponse.json({ error: "Failed to fetch saved properties" }, { status: 500 });
  }
}