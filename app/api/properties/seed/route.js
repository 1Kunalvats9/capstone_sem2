import { connectToMongoDb } from "@/lib/connectMongoDb";
import { Property } from "@/models/userModel";
import User from "@/models/userModel";
import { NextResponse } from "next/server";
import { generateRandomProperty } from "@/lib/generateProperties";

export async function POST(req) {
  try {
    await connectToMongoDb();
    const { count = 30, ownerEmail = 'admin@propbid.com' } = await req.json();

    let user = await User.findOne({ email: ownerEmail });
    if (!user) {
      user = new User({
        userName: 'Admin',
        email: ownerEmail,
        password: 'hashedpassword',
        userType: 'Seller'
      });
      await user.save();
    }

    const properties = [];
    for (let i = 0; i < count; i++) {
      const propertyData = await generateRandomProperty(i);
      
      const newProperty = new Property({
        owner: user._id,
        ...propertyData
      });

      await newProperty.save();
      user.publishedProperties.push(newProperty._id);
      properties.push(newProperty);
    }

    await user.save();

    return NextResponse.json({ 
      message: `${count} properties seeded successfully`, 
      properties: properties.length 
    }, { status: 201 });

  } catch (error) {
    console.error("Error seeding properties:", error);
    return NextResponse.json({ error: "Failed to seed properties" }, { status: 500 });
  }
}