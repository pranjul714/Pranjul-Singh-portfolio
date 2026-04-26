import mongoose from "mongoose";

const aboutSchema = new mongoose.Schema({
  bio: { type: String, required: true },
  experience_years: { type: Number },
  education: { type: String },
}, { timestamps: true });

export default mongoose.model("About", aboutSchema);
