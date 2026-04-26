import express from "express";
const router = express.Router();
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Project from "../models/Project.js";
import Skill from "../models/Skill.js";
import Contact from "../models/Contact.js";
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
    const user = await User.findOne({ username });

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
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put("/projects/:id", protect, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(project);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.delete("/projects/:id", protect, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
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
    res.status(201).json(skill);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.delete("/skills/:id", protect, async (req, res) => {
  try {
    await Skill.findByIdAndDelete(req.params.id);
    res.json({ message: "Skill removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
