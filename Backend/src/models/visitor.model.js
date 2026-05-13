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
  os: {
    type: String,
    default: "Unknown"
  },
  deviceType: {
    type: String,
    default: "Desktop"
  },
  referrer: {
    type: String,
    default: "Direct"
  },
  lat: Number,
  lon: Number,
  lastActive: { type: Date, default: Date.now },
  actions: [{
    type: { type: String }, // 'view' or 'click'
    name: String,           // page name or button name
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export const Visitor = mongoose.model("Visitor", visitorSchema);
