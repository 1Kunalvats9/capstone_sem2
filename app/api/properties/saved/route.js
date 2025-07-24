import { connectToMongoDb } from "@/lib/connectMongoDb";
import User from "@/models/userModel";
import { Property } from "@/models/userModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectToMongoDb();
    const { email, propertyId } = await req.json();

    if (!email || !propertyId) {
      return NextResponse.json({ error: "Missing email or property ID" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    const isAlreadySaved = user.savedProperties.includes(propertyId);

    if (isAlreadySaved) {
      user.savedProperties = user.savedProperties.filter(id => id.toString() !== propertyId);
      await user.save();
      return NextResponse.json({ message: "Property removed from saved list" }, { status: 200 });
    } else {
      user.savedProperties.push(propertyId);
      await user.save();
      return NextResponse.json({ message: "Property saved successfully" }, { status: 200 });
    }

  } catch (error) {
    console.error("Error saving/unsaving property:", error);
    return NextResponse.json({ error: "Failed to save/unsave property" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connectToMongoDb();

    const propertySchemaObject = Property.schema.obj;

    const simplifySchema = (schema) => {
      const result = {};
      for (const key in schema) {
        if (Object.prototype.hasOwnProperty.call(schema, key)) {
          const field = schema[key];
          if (field.type && typeof field.type === 'function') {
            result[key] = {
              type: field.type.name,
              required: field.required || false,
              unique: field.unique || false,
              default: field.default,
              enum: field.enum,
            };
          } else if (typeof field === 'object' && !Array.isArray(field)) {
            result[key] = simplifySchema(field);
          } else if (Array.isArray(field) && field.length > 0) {
            result[key] = {
              type: 'Array',
              of: field[0].type ? field[0].type.name : 'Object'
            }
          }
          else {
            result[key] = field.name;
          }
        }
      }
      return result;
    };

    const simplifiedSchema = simplifySchema(propertySchemaObject);

    return NextResponse.json({ schema: simplifiedSchema }, { status: 200 });

  } catch (error) {
    console.error("Error fetching property schema:", error);
    return NextResponse.json({ error: "Failed to fetch property schema" }, { status: 500 });
  }
}