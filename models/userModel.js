import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  id:String,
  bathroom:Number,
  bedroom:Number,
  location:String,
  price:Number,
  sizeSqFt:Number,
  title:String
})
const userSchema = new mongoose.Schema({
  userName: String,
  email: String,
  password: String,
  saved: {
    properties: [propertySchema], 
  },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;