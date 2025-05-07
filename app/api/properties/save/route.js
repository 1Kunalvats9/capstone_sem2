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

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: 'User not found with this email' }, { status: 404 });
    }
    if (!user.saved) {
      user.saved = { properties: [] };
    } else if (!user.saved.properties) {
      user.saved.properties = [];
    }

    user.saved.properties.push(property);
    await user.save();

    return NextResponse.json({ message: 'Property saved successfully', saved: user.saved }, { status: 200 });

  } catch (error) {
    console.error('Error saving property:', error);
    return NextResponse.json({ error: 'Failed to save property' }, { status: 500 });
  }
}