import mongoose from "mongoose";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const existingUser = await User.findOne({ username: "admin" });
    if (existingUser) {
      console.log("Admin user already exists");
      process.exit();
    }

    const admin = new User({
      username: process.env.ADMIN_USERNAME || "admin",
      password: process.env.ADMIN_PASSWORD || "admin123",
      email: process.env.ADMIN_EMAIL || "admin@example.com"
    });

    await admin.save();
    console.log("Admin user created successfully!");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createAdmin();
