import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  proficiency: { type: Number, default: 0 },
  category: { type: String }, 
}, { timestamps: true });

module.exports = mongoose.model("Skill", skillSchema);
