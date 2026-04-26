 import mongoose from "mongoose";

const homeSchema = new mongoose.Schema({
  hero_title: { type: String, required: true },
  hero_subtitle: { type: String },
  resume_url: { type: String },
  profile_image: { type: String },
}, { timestamps: true });

export default mongoose.model("Home", homeSchema);
