import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: "dp4ys7vhw",
  api_key: "747115241865951",
  api_secret: "jB8o2GoPLah9g2to-fufXkttC0s"
});

// ─── Professional Upload (Dono handle karega)
const uploadOnCloudinary = async (source) => {
  try {
    if (!source) return null;

    // source yahan 'file path' bhi ho sakta hai (Menu Image)
    // aur 'base64 string' bhi (QR Code)
    const response = await cloudinary.uploader.upload(source, {
      resource_type: "auto",
      folder: "portfolio_assets" // Sari images ek folder mein rahengi
    }); 

    // FIX: Pehle check karo ki kya ye koi real file hai disk par?
    // Agar Multer se aayi image hai, tabhi delete karo.
    if (fs.existsSync(source)) {
      fs.unlinkSync(source);
    }

    return response;

  } catch (error) {
    console.error("Cloudinary Upload Error:", error.message);
    // REMOVED: Do not delete local file here so caller can use it as fallback
    /*
    if (source && fs.existsSync(source)) {
      fs.unlinkSync(source);
    }
    */
    return null;
  }
};

// ─── Optimized URL ────────────────────────────────────────────────────────────
const getOptimizedUrl = (public_id) => {
  return cloudinary.url(public_id, {
    fetch_format: "auto",
    quality: "auto",
    secure: true
  });
};

// ─── Auto Crop URL ────────────────────────────────────────────────────────────
const getAutoCropUrl = (public_id, width = 500, height = 500) => {
  try {
    return cloudinary.url(public_id, {
      crop: "fill", // 'fill' professional dikhta hai menu ke liye
      gravity: "auto",
      width,
      height,
      secure: true 
    });
  } catch (error) {
    return "";
  }
};

export { uploadOnCloudinary, getOptimizedUrl, getAutoCropUrl };
