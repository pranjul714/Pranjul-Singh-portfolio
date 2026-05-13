import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

const fixPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');
    
    const email = 'pranjulsingh38@gmail.com';
    const newPassword = 'mrs1234';
    
    const user = await User.findOne({ email });
    if (user) {
      user.password = newPassword;
      await user.save();
      console.log(`✅ Password for ${email} has been reset to: ${newPassword}`);
    } else {
      console.log('❌ User not found');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixPassword();
