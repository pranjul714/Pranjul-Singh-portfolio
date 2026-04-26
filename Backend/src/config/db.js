import mongoose from "mongoose"; 
import dotenv from "dotenv";
dotenv.config();



const connectDB= async () => 
{
try{
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));
}
catch (err) {
    console.log("❌ MongoDB Connection Error:", err);
}
}

export default connectDB;