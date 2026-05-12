import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true
  },
  city: {
    type: String,
    default: "Unknown"
  },
  region: {
    type: String,
    default: "Unknown"
  },
  country: {
    type: String,
    default: "Unknown"
  },
  browser: {
    type: String,
    default: "Unknown"
  },
  referrer: {
    type: String,
    default: "Direct"
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export const Visitor = mongoose.model("Visitor", visitorSchema);
