const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

/* ===============================
   CORS CONFIGURATION
   =============================== */

const allowedOrigins = [
  "http://localhost:5173",
  "https://pranjul-singh-portfolio.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      // Allow exact URLs
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow all Vercel preview deployments
      if (origin.includes(".vercel.app")) {
        return callback(null, true);
      }

      console.log("❌ Blocked by CORS:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());

/* ===============================
   NODEMAILER CONFIGURATION
   =============================== */

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error("❌ EMAIL_USER or EMAIL_PASS missing in environment variables");
}

const transporter = nodemailer.createTransport({
  service: "gmail", // ✅ Stable config
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify email connection
transporter.verify(function (error) {
  if (error) {
    console.error("❌ Email Config Error:", error);
  } else {
    console.log("✅ Email Server Ready");
  }
});

/* ===============================
   ROUTES
   =============================== */

// Health check route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is running 🚀",
  });
});

// Contact API
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const mailOptions = {
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `New Inquiry: ${subject}`,
      text: `
Name: ${name}
Email: ${email}

Message:
${message}
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log("✅ Email Sent Successfully");

    return res.status(200).json({
      success: true,
      message: "Email sent successfully!",
    });
  } catch (error) {
    console.error("❌ Mail Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

/* ===============================
   GLOBAL ERROR HANDLER
   =============================== */

app.use((err, req, res, next) => {
  console.error("❌ Global Error:", err.message);
  res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
});

/* ===============================
   START SERVER
   =============================== */

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
