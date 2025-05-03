import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI

export const connectToMongoDb = async ()=>{
    try{
        await mongoose.connect(MONGODB_URI)
        console.log("Mongodb connected succesfully")
    }catch(err){
        console.log("error in connecting to db",err)
    }
}