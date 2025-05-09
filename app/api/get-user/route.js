import { connectToMongoDb } from "@/lib/connectMongoDb";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

export async function POST(req){
    try{
        await connectToMongoDb()
        const {email} = await req.json()
        const user = await User.findOne({email})
        if(!user){
            return NextResponse.json({mssg:"User not found"},{status:404})
        }
        return NextResponse.json({user},{status:200})

    }catch(err){
        return NextResponse.json({error:err},{status:500})
    }
}