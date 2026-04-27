import express from "express";
const router = express.Router();
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Project from "../models/Project.js";
import Skill from "../models/Skill.js";
import Contact from "../models/Contact.js";
import Home from "../models/Home.js";
import About from "../models/About.js";
import { protect } from "../middleware/authMiddleware.js";

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

// PROJECTS CRUD
router.get("/projects", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/projects", protect, async (req, res) => {
  try {
    const project = await Project.create(req.body);
    req.app.get("io").emit("data_updated", { type: "projects" });
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put("/projects/:id", protect, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
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

router.post("/home", protect, async (req, res) => {
  try {
    const home = await Home.findOneAndUpdate({}, req.body, { upsert: true, new: true });
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
