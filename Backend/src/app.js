import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import nodemailer from "nodemailer";
import fs from "fs";
import adminRoutes from "./routes/adminRoutes.js";
import Contact from "./models/Contact.js";
import { trackVisitor } from "./middleware/visitor.middleware.js";
import { Visitor } from "./models/visitor.model.js";

dotenv.config();

// Ensure upload temp directory exists
if (!fs.existsSync('./public/temp')) fs.mkdirSync('./public/temp', { recursive: true });

const app = express();

// Enable trust proxy to get real visitor IP
app.set('trust proxy', 1);

// ── CORS ──────────────────────────────────────────────────────────
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5000",
  "https://pranjul-singh-portfolio.vercel.app",
  "https://portfolio-admin-phi-umber.vercel.app",
  "https://pranjul-singh.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      const isAllowed = allowedOrigins.includes(origin) || 
                        origin.endsWith(".vercel.app") || 
                        origin.endsWith(".onrender.com");

      if (isAllowed) {
        return callback(null, true);
      } else {
        console.log(" CORS Blocked Origin:", origin);
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// ── Security Headers ──────────────────────────────────────────────
app.use(helmet());

// ── Request Logging ───────────────────────────────────────────────
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(trackVisitor);

// ── Rate Limiting ─────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 500,                 // Increased to 500 requests per minute for smooth dashboard usage
  message: { success: false, message: "Too many requests, please try again after a minute." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Stricter limit for contact form (spam protection)
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50,                   // increased to 50 contact submissions per IP per hour for better testing
  message: { success: false, message: "Too many messages sent. Please try again after an hour." },
});

// ── Body Parser ───────────────────────────────────────────────────
app.use(express.json({ limit: "10kb" })); // Prevent large payload attacks


// ── Nodemailer Config ─────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ── Routes ────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Portfolio Backend is running 🚀" });
});

app.use("/api/admin", adminRoutes);

// ── Action Tracking Route ─────────────────────────────────────────
app.post("/api/track", (req, res) => {
  // Respond immediately to prevent latency on frontend
  res.status(200).json({ success: true });

  (async () => {
    try {
      const { type, name } = req.body;
      let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || "";
      if (ip.includes(',')) ip = ip.split(',')[0].trim();
      if (ip.startsWith('::ffff:')) ip = ip.replace('::ffff:', '');

      // Find the latest visitor record for this IP within the last 24 hours (more lenient)
      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const visitor = await Visitor.findOne({ ip, createdAt: { $gte: dayAgo } }).sort({ createdAt: -1 });

      if (visitor) {
        visitor.actions.push({ actionType: type, name });
        await visitor.save();
        
        // Notify admin live that an action happened
        const io = req.app.get("io");
        if (io) {
          io.emit("visitor_action", {
            ip,
            type,
            name,
            city: visitor.city
          });
        }
      }
    } catch (error) {
      console.error("Tracking Error:", error.message);
    }
  })();
});

// ── Session Heartbeat Route ───────────────────────────────────────
app.post("/api/heartbeat", (req, res) => {
  // Respond immediately
  res.status(200).json({ success: true });

  (async () => {
    try {
      let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || "";
      if (ip.includes(',')) ip = ip.split(',')[0].trim();
      if (ip.startsWith('::ffff:')) ip = ip.replace('::ffff:', '');

      const visitor = await Visitor.findOne({ ip }).sort({ createdAt: -1 });
      if (visitor) {
        visitor.lastActive = new Date();
        await visitor.save();
      }
    } catch (error) {
      console.error("Heartbeat Error:", error.message);
    }
  })();
});

// Contact Route with spam rate limiting
app.post("/api/contact", contactLimiter, async (req, res) => {
  console.log("📩 Incoming contact request from:", req.headers.origin);
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (message.length > 2000) {
      return res.status(400).json({ success: false, message: "Message too long (max 2000 chars)" });
    }

    const newContact = await Contact.create({ name, email, subject, message });
    console.log("✅ Message saved to DB:", newContact._id);

    // Send success response immediately so the frontend doesn't hang
    res.status(200).json({
      success: true,
      message: "Message received! I'll get back to you soon.",
      data: newContact,
    });

    // Notify admin via Socket.io
    const io = req.app.get("io");
    if (io) {
      io.emit("data_updated", { type: "contacts" });
    }

    // Send email notification in the background
    if (
      process.env.EMAIL_USER &&
      process.env.EMAIL_PASS &&
      !process.env.EMAIL_USER.includes("your_email") &&
      !process.env.EMAIL_PASS.includes("your_gmail_app_password_here")
    ) {
      const mailOptions = {
        from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        replyTo: email,
        subject: `New Inquiry: ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      };
      
      transporter.sendMail(mailOptions)
        .then(() => console.log("📧 Email notification sent"))
        .catch(err => console.error("📧 Mail Sending Error:", err));
    }
  } catch (error) {
    console.error("❌ Contact Error:", error);
    return res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
  }
});

// ── 404 Handler ───────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ── Global Error Handler ──────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("❌ Global Error:", err.message);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: process.env.NODE_ENV === "production" ? "Something went wrong" : err.message,
  });
});

export default app;
