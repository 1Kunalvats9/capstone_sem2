import { connectToMongoDb } from "@/lib/connectMongoDb";
import { Property } from "@/models/userModel";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectToMongoDb();
    const { id } = params;

    const property = await Property.findById(id)
      .populate('owner', 'userName email phoneNumber')
      .populate('highestBidder', 'userName email');

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    return NextResponse.json({ property }, { status: 200 });

  } catch (error) {
    console.error("Error fetching property:", error);
    return NextResponse.json({ error: "Failed to fetch property" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectToMongoDb();
    const { id } = params;
    const updateData = await req.json();

    const property = await Property.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('owner', 'userName email');

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      message: "Property updated successfully", 
      property 
    }, { status: 200 });

  } catch (error) {
    console.error("Error updating property:", error);
    return NextResponse.json({ error: "Failed to update property" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectToMongoDb();
    const { id } = params;

    const property = await Property.findByIdAndDelete(id);

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Property deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error deleting property:", error);
    return NextResponse.json({ error: "Failed to delete property" }, { status: 500 });
  }
}