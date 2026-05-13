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
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      const isAllowed = origin.startsWith("http://localhost") || 
                        origin.endsWith(".vercel.app") || 
                        origin.endsWith(".onrender.com");
      if (isAllowed) {
        return callback(null, true);
      }
      return callback(new Error("Socket.IO: Not allowed by CORS"));
    },
    methods: ["GET", "POST"],
  },
});

// Connect to Database
connectDB();

// Socket Connection
io.on("connection", (socket) => {
  // Silent connection
  socket.on("disconnect", () => {});
});

// Make io accessible in routes
app.set("io", io);

// Start Server
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
