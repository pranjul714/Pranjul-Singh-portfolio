import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

/**
 * Seed Script — Run ONCE to create the admin user.
 * Usage: node src/seedUser.js
 *
 * ⚠️  Set ADMIN_EMAIL, ADMIN_USERNAME, ADMIN_PASSWORD in your .env before running!
 */
const seedUser = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const username = process.env.ADMIN_USERNAME || "admin";

  if (!email || !password) {
    console.error("❌ Please set ADMIN_EMAIL and ADMIN_PASSWORD in your .env file before seeding.");
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("❌ ADMIN_PASSWORD must be at least 8 characters long.");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("ℹ️  User already exists. Updating password...");
      existingUser.password = password;
      await existingUser.save();
      console.log("✅ Admin password updated successfully!");
    } else {
      await User.create({ username, email, password });
      console.log(`✅ Admin user created: ${email}`);
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding user:", error.message);
    process.exit(1);
  }
};

seedUser();
