import { connectToMongoDb } from "@/lib/connectMongoDb";
import { Property } from "@/models/userModel";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    try {
      await connectToMongoDb();
    } catch (dbError) {
      console.error("Database connection failed:", dbError);
      return NextResponse.json({ 
        error: "Database connection failed", 
        properties: [],
        pagination: { page: 1, limit: 12, total: 0, pages: 0 }
      }, { status: 500 });
    }
    
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 12;
    const search = searchParams.get('search') || '';
    const propertyType = searchParams.get('propertyType') || '';
    const minPrice = parseInt(searchParams.get('minPrice')) || 0;
    const maxPrice = parseInt(searchParams.get('maxPrice')) || Infinity;

    const skip = (page - 1) * limit;

    let query = { status: 'Available' };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } },
        { 'location.state': { $regex: search, $options: 'i' } }
      ];
    }

    if (propertyType) {
      query.propertyType = propertyType;
    }

    if (minPrice > 0 || maxPrice < Infinity) {
      query.price = { $gte: minPrice, $lte: maxPrice };
    }

    const properties = await Property.find(query)
      .populate('owner', 'userName email')
      .populate('highestBidder', 'userName email')
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Property.countDocuments(query);

    return NextResponse.json({
      properties,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching properties:", error);
    return NextResponse.json({ error: "Failed to fetch properties" }, { status: 500 });
  }
}