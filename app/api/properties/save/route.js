import { connectToMongoDb } from "@/lib/connectMongoDb";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectToMongoDb();
    const { email, property } = await req.json();

    if (!email || !property) {
      return NextResponse.json({ error: 'Missing email or property' }, { status: 400 });
    }

    const { id, bathrooms, bedrooms, location, price, sizeSqFt, title } = property;

    if (!id || bathrooms === undefined || bedrooms === undefined || !location || price === undefined || !sizeSqFt || !title) {
      return NextResponse.json({ error: 'Missing required property details (id, bathroom, bedroom, location, price, sizeSqFt, title)' }, { status: 400 });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: 'User not found with this email' }, { status: 404 });
    }
    if (!user.saved) {
      user.saved = { properties: [] };
    } else if (!user.saved.properties) {
      user.saved.properties = [];
    }

    const existingPropertyIndex = user.saved.properties.findIndex(
      (savedProperty) => savedProperty.id === id
    );

    if (existingPropertyIndex === -1) {
      user.saved.properties.push({
        id,
        bathrooms, 
        bedrooms,  
        location,
        price,
        sizeSqFt,
        title,
      });
      await user.save();
      return NextResponse.json({ message: 'Property saved successfully', saved: user.saved }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Property is already saved' }, { status: 200 });
    }

  } catch (error) {
    console.error('Error saving property:', error);
    return NextResponse.json({ error: 'Failed to save property', message: error.message || 'Server error during save' }, { status: 500 });
  }
}