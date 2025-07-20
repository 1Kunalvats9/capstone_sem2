import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/propertybid"

export const connectToMongoDb = async ()=>{
    try{
        if (!MONGODB_URI) {
            throw new Error("MONGODB_URI environment variable is not defined")
        }
        await mongoose.connect(MONGODB_URI)
        console.log("Mongodb connected succesfully")
    }catch(err){
        console.log("error in connecting to db",err)
        throw err
    }
}