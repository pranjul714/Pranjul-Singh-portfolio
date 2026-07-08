import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import User from './src/models/User.js';

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const user = await User.findOne({
    $or: [{ email: process.env.ADMIN_EMAIL }, { username: process.env.ADMIN_USERNAME }],
  });
  console.log(JSON.stringify(user, null, 2));
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
