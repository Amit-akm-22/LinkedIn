import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import http from "http";
import { Server } from "socket.io";
import fs from "fs";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import notificationRoutes from "./routes/notification.route.js";
import connectionRoutes from "./routes/connection.route.js";
import messageRoutes from "./routes/message.route.js";
import jobRoutes from "./routes/job.route.js";
import applicationRoutes from "./routes/application.route.js";

import { connectDB } from "./lib/db.js";
import Message from "./models/message.model.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// ✅ Ensure upload folders exist
["uploads", "uploads/companies", "uploads/resumes"].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created folder: ${dir}`);
  }
});

// ✅ Create server
const server = http.createServer(app);

// ✅ Configure allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://linked-in-frontend-six.vercel.app", // your Vercel frontend
];

// ✅ Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://linked-in-frontend-six.vercel.app", // ✅ Match exactly
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ✅ Track active users
const activeUsers = new Map();

io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  socket.on("user-online", (userId) => {
    activeUsers.set(userId, socket.id);
    io.emit("user-status", { userId, status: "online" });
  });

  socket.on("join-chat", ({ senderId, receiverId }) => {
    const roomId = [senderId, receiverId].sort().join("-");
    socket.join(roomId);
  });

  socket.on("send-message", async ({ senderId, receiverId, message }) => {
    try {
      const roomId = [senderId, receiverId].sort().join("-");
      const messageData = {
        senderId,
        receiverId,
        message,
        timestamp: new Date(),
      };

      io.to(roomId).emit("receive-message", messageData);

      const receiverSocketId = activeUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("new-message-notification", {
          senderId,
          message,
        });
      }
    } catch (err) {
      console.error("❌ Message error:", err);
      socket.emit("error", { message: "Message failed" });
    }
  });

  socket.on("typing", ({ senderId, receiverId }) => {
    const receiverSocketId = activeUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("user-typing", { senderId });
    }
  });

  socket.on("stop-typing", ({ senderId, receiverId }) => {
    const receiverSocketId = activeUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("user-stop-typing", { senderId });
    }
  });

  socket.on("mark-read", async ({ senderId, receiverId }) => {
    try {
      await Message.updateMany(
        { senderId: receiverId, receiverId: senderId, read: false },
        { read: true }
      );
      const receiverSocketId = activeUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("messages-read", { readBy: senderId });
      }
    } catch (err) {
      console.error("❌ Read status error:", err);
    }
  });

  socket.on("disconnect", () => {
    for (let [userId, socketId] of activeUsers.entries()) {
      if (socketId === socket.id) {
        activeUsers.delete(userId);
        io.emit("user-status", { userId, status: "offline" });
        console.log(`🔴 User ${userId} disconnected`);
        break;
      }
    }
  });
});

// ✅ Expose io globally (for routes)
app.set("io", io);

// ✅ CORS middleware

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://linked-in-frontend-six.vercel.app", // ✅ NO trailing slash
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // ✅ Essential for cookies
  })
);


// ✅ Middlewares
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/connections", connectionRoutes);
app.use("/api/v1/messages", messageRoutes);
app.use("/api/v1/jobs", jobRoutes);
app.use("/api/v1/applications", applicationRoutes);

// ✅ Optional alias
app.use("/auth", authRoutes);

// ✅ Serve frontend build (optional for local full-stack build)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

// ✅ Start server + connect DB
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  connectDB();
});
