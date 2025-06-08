import mongoose from 'mongoose';

// --- Property Schema ---
const propertySchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  propertyType: {
    type: String,
    required: true,
    enum: ['Apartment', 'House', 'Land', 'Commercial', 'Ranch', 'Villa', 'Condo', 'Townhouse'],
  },
  location: {
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    zipCode: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true, default: 'India' },
    coordinates: {
      type: [Number],
      index: '2dsphere',
    },
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  bedrooms: {
    type: Number,
    required: true,
    min: 0,
  },
  bathrooms: {
    type: Number,
    required: true,
    min: 0,
  },
  sizeSqFt: {
    type: Number,
    required: true,
    min: 0,
  },
  amenities: [{ type: String, trim: true }],
  images: [{ type: String }],
  status: {
    type: String,
    enum: ['Available', 'Under Offer', 'Sold', 'Draft', 'Hidden'],
    default: 'Available',
  },
  publishedAt: {
    type: Date,
    default: Date.now,
  },
  isBiddingActive: {
    type: Boolean,
    default: false,
  },
  biddingEndsAt: {
    type: Date,
  },
  startingBid: {
    type: Number,
    min: 0,
  },
  currentHighestBid: {
    type: Number,
    default: 0,
  },
  highestBidder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

// --- Bid Schema ---
const bidSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true,
  },
  bidder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  bidAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  bidTime: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// --- User Schema ---
const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  phoneNumber: {
    type: String,
    trim: true,
  },
  userType: {
    type: String,
    enum: ['Buyer', 'Seller', 'Both'],
    default: 'Buyer',
  },
  publishedProperties: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
  }],
  savedProperties: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
  }],
  bidsMade: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bid',
  }],
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  profilePicture: { type: String },
}, { timestamps: true });

// --- Models ---
const Property = mongoose.models.Property || mongoose.model('Property', propertySchema);
const Bid = mongoose.models.Bid || mongoose.model('Bid', bidSchema);
const User = mongoose.models.User || mongoose.model('User', userSchema);

export { User, Property, Bid };