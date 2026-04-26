const mongoose = require("mongoose");

const aboutSchema = new mongoose.Schema({
  bio: { type: String, required: true },
  experience_years: { type: Number },
  education: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("About", aboutSchema);
