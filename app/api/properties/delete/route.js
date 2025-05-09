import { connectToMongoDb } from "@/lib/connectMongoDb";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectToMongoDb();
    const { email, property } = await req.json();

    if (!email || !property?.id) {
      return NextResponse.json({ error: "Missing email or property ID" }, { status: 400 });
    }

    const user = await User.findOneAndUpdate(
      { email },
      { $pull: { 'saved.properties': { id: property.id } } },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Property unsaved successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error unsaving property:", error);
    return NextResponse.json({ error: "Failed to unsave property" }, { status: 500 });
  }
}