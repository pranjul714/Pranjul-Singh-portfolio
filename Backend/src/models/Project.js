import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String },
  tech: [{ type: String }],
  github: { type: String },
  live: { type: String },
  image: { type: String },   
  icon: { type: String }, 
  category: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Project", projectSchema);
