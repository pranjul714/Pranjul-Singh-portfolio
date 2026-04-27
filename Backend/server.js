import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import app from "./src/app.js";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();

const PORT = process.env.PORT || 5000;
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Adjust this in production for security
    methods: ["GET", "POST"]
  }
});

// Connect to Database
connectDB();

// Socket Connection
io.on("connection", (socket) => {
  console.log("🔌 New client connected:", socket.id);
  socket.on("disconnect", () => console.log("👋 Client disconnected"));
});

// Make io accessible in routes
app.set("io", io);

// Start Server
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
