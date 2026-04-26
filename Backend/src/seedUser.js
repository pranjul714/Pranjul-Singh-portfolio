import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const seedUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const email = "pranjulsingh38@gmail.com";
    const password = "123456";
    const username = "admin"; // Default username

   
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists. Updating password...");
      existingUser.password = password; 
      await existingUser.save();
      console.log("User updated successfully!");
    } else {
      const newUser = new User({
        username,
        email,
        password,
      });
      await newUser.save();
      console.log("User created successfully!");
    }

    process.exit();
  } catch (error) {
    console.error("Error seeding user:", error);
    process.exit(1);
  }
};

seedUser();
