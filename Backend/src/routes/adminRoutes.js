import express from "express";
const router = express.Router();
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import User from "../models/User.js";
import Project from "../models/Project.js";
import Skill from "../models/Skill.js";
import Contact from "../models/Contact.js";
import Home from "../models/Home.js";
import About from "../models/About.js";
import { Visitor } from "../models/visitor.model.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/multerMiddleware.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";


// @route   GET /api/admin/stats/visitors
// @desc    Get visitor statistics
router.get("/stats/visitors", protect, async (req, res) => {
  try {
    const totalVisits = await Visitor.countDocuments();
    const latestVisitors = await Visitor.find().sort({ createdAt: -1 }).limit(10);
    
    // Get stats for today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayVisits = await Visitor.countDocuments({ createdAt: { $gte: startOfToday } });

    res.json({
      success: true,
      totalVisits,
      todayVisits,
      latestVisitors,
      recentActions: await Visitor.aggregate([
        { $match: { actions: { $exists: true, $not: { $size: 0 } } } },
        { $unwind: "$actions" },
        { $sort: { "actions.timestamp": -1 } },
        { $limit: 20 },
        { $project: { 
          _id: 0, 
          ip: 1, 
          city: 1, 
          type: "$actions.actionType", 
          name: "$actions.name", 
          timestamp: "$actions.timestamp" 
        } }
      ]) || []
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/admin/contacts
// @desc    Get all contact messages
router.get("/contacts", protect, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/admin/login
// @desc    Admin login & get token
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check for user by username or email
    const user = await User.findOne({
      $or: [{ username: username }, { email: username }],
    });

    if (user && (await user.comparePassword(password))) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });

      res.json({ success: true, token });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


router.post("/forget-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Password reset token should be short-lived
    });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5174'}/reset-password/${token}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2>Password Reset Request</h2>
          <p>You requested to reset your password. Click the button below to proceed:</p>
          <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #10b981; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">Reset Password</a>
          <p style="margin-top: 20px; font-size: 0.8rem; color: #666;">If you didn't request this, please ignore this email. This link will expire in 1 hour.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Password reset link sent to your email" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Assign plain password; the User model's pre-save hook will handle hashing
    user.password = password;
    await user.save();

    res.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: "Invalid or expired token" });
  }
});

// PROJECTS CRUD
router.get("/projects", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/projects", protect, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'icon', maxCount: 1 }]), async (req, res) => {
  try {
    const data = { ...req.body };
    
    if (req.files) {
      if (req.files.image) {
        const result = await uploadOnCloudinary(req.files.image[0].path);
        if (result) data.image = result.secure_url;
      }
      if (req.files.icon) {
        const result = await uploadOnCloudinary(req.files.icon[0].path);
        if (result) data.icon = result.secure_url;
      }
    }

    const project = await Project.create(data);
    req.app.get("io").emit("data_updated", { type: "projects" });
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});


router.put("/projects/:id", protect, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'icon', maxCount: 1 }]), async (req, res) => {
  try {
    const data = { ...req.body };

    if (req.files) {
      if (req.files.image) {
        const result = await uploadOnCloudinary(req.files.image[0].path);
        if (result) data.image = result.secure_url;
      }
      if (req.files.icon) {
        const result = await uploadOnCloudinary(req.files.icon[0].path);
        if (result) data.icon = result.secure_url;
      }
    }

    const project = await Project.findByIdAndUpdate(req.params.id, data, { new: true });
    req.app.get("io").emit("data_updated", { type: "projects" });
    res.json(project);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});


router.delete("/projects/:id", protect, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    req.app.get("io").emit("data_updated", { type: "projects" });
    res.json({ message: "Project removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// SKILLS CRUD
router.get("/skills", async (req, res) => {
  try {
    const skills = await Skill.find().sort({ createdAt: -1 });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/skills", protect, async (req, res) => {
  try {
    const skill = await Skill.create(req.body);
    req.app.get("io").emit("data_updated", { type: "skills" });
    res.status(201).json(skill);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.delete("/skills/:id", protect, async (req, res) => {
  try {
    await Skill.findByIdAndDelete(req.params.id);
    req.app.get("io").emit("data_updated", { type: "skills" });
    res.json({ message: "Skill removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// HOME SETTINGS
router.get("/home", async (req, res) => {
  try {
    const home = await Home.findOne();
    res.json(home);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/home", protect, upload.fields([{ name: 'profile_image', maxCount: 1 }, { name: 'resume', maxCount: 1 }]), async (req, res) => {
  try {
    const data = { ...req.body };

    if (req.files) {
      if (req.files.profile_image) {
        const result = await uploadOnCloudinary(req.files.profile_image[0].path);
        if (result) data.profile_image = result.secure_url;
      }
      if (req.files.resume) {
        const result = await uploadOnCloudinary(req.files.resume[0].path);
        if (result) data.resume_url = result.secure_url;
      }
    }

    const home = await Home.findOneAndUpdate({}, data, { upsert: true, new: true });
    res.json(home);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});


// ABOUT SETTINGS
router.get("/about", async (req, res) => {
  try {
    const about = await About.findOne();
    res.json(about);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/about", protect, async (req, res) => {
  try {
    const about = await About.findOneAndUpdate({}, req.body, { upsert: true, new: true });
    res.json(about);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
