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
      username: "admin",
      password: "admin123", // Change this later!
      email: "admin@example.com" // Added email as it is required in the schema
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
