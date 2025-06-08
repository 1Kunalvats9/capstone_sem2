import { connectToMongoDb } from "@/lib/connectMongoDb";
import { Property } from "@/models/userModel";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectToMongoDb();
    const { 
      email, 
      title, 
      description, 
      propertyType, 
      location, 
      price, 
      bedrooms, 
      bathrooms, 
      sizeSqFt, 
      amenities, 
      images,
      isBiddingActive,
      biddingEndsAt,
      startingBid
    } = await req.json();

    if (!email || !title || !description || !propertyType || !location || !price || !bedrooms || !bathrooms || !sizeSqFt) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const newProperty = new Property({
      owner: user._id,
      title,
      description,
      propertyType,
      location: {
        address: location.address,
        city: location.city,
        state: location.state,
        zipCode: location.zipCode,
        country: location.country || 'India'
      },
      price,
      bedrooms,
      bathrooms,
      sizeSqFt,
      amenities: amenities || [],
      images: images || [],
      isBiddingActive: isBiddingActive || false,
      biddingEndsAt: biddingEndsAt ? new Date(biddingEndsAt) : null,
      startingBid: startingBid || price,
      currentHighestBid: startingBid || price
    });

    await newProperty.save();

    user.publishedProperties.push(newProperty._id);
    await user.save();

    return NextResponse.json({ 
      message: "Property created successfully", 
      property: newProperty 
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating property:", error);
    return NextResponse.json({ error: "Failed to create property" }, { status: 500 });
  }
}