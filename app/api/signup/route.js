import { connectToMongoDb } from "@/lib/connectMongoDb";
import User from "@/models/userModel";
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server";

export async function POST(req){
    try{
        await connectToMongoDb();
        const {name,email,password} = await req.json();
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            userName:name,
            email,
            password:hashedPassword
        })
        await newUser.save()
        return NextResponse.json({ message: 'User registered successfully', user: newUser }, { status: 201 });
    }catch(err){
        console.error('Register Error:', err);
        return NextResponse.json({ error: 'Error in signing up request' }, { status: 500 });
    }
}