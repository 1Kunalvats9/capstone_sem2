import { NextResponse } from 'next/server';
import {connectToMongoDb} from "@/lib/connectMongoDb.js";
import {Property} from "@/models/userModel.js";
import User from "@/models/userModel.js"

export async function POST(req) {
    try {
        await connectToMongoDb();

        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (!user.savedProperties || user.savedProperties.length === 0) {
            return NextResponse.json({ savedProperties: [] }, { status: 200 });
        }

        const savedPropertyIds = user.savedProperties;

        const savedProperties = await Property.find({
            '_id': { $in: savedPropertyIds }
        });

        return NextResponse.json({
            success: true,
            savedProperties: savedProperties
        }, { status: 200 });

    } catch (error) {
        console.error("Failed to fetch saved properties:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}