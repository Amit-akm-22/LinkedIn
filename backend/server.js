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

// ✅ Ensure upload directories exist
const uploadDirs = ["uploads", "uploads/companies", "uploads/resumes"];
uploadDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
});

// ✅ Create HTTP server
const server = http.createServer(app);

// ✅ Initialize Socket.IO with clean CORS
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "linked-in-7gc7.vercel.app",
      "https://linked-in-7gc7.vercel.app",
      "https://linkedin-backend-f1os.onrender.com"
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ✅ Store active users: { userId: socketId }
const activeUsers = new Map();

// ✅ SOCKET.IO EVENTS
io.on("connection", (socket) => {
  console.log("🟢 New client connected:", socket.id);

  // When user comes online
  socket.on("user-online", (userId) => {
    activeUsers.set(userId, socket.id);
    console.log(`✅ User ${userId} is online`);
    io.emit("user-status", { userId, status: "online" });
  });

  // Join chat room
  socket.on("join-chat", ({ senderId, receiverId }) => {
    const roomId = [senderId, receiverId].sort().join("-");
    socket.join(roomId);
    console.log(`💬 User ${senderId} joined room ${roomId}`);
  });

  // Send message
  socket.on("send-message", async ({ senderId, receiverId, message }) => {
    try {
      const roomId = [senderId, receiverId].sort().join("-");
      const messageData = {
        senderId,
        receiverId,
        message,
        timestamp: new Date(),
      };

      // Send message to both users in room
      io.to(roomId).emit("receive-message", messageData);

      // Notify receiver if online
      const receiverSocketId = activeUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("new-message-notification", {
          senderId,
          message,
        });
      }
    } catch (error) {
      console.error("❌ Error sending message:", error);
      socket.emit("error", { message: "Failed to send message" });
    }
  });

  // Typing indicator
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

  // Mark messages as read
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
    } catch (error) {
      console.error("❌ Error marking messages as read:", error);
    }
  });

  // On disconnect
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

// ✅ Make io accessible in routes
app.set("io", io);

// ✅ Express CORS setup
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://linked-in-sooty.vercel.app",
      "https://linkedin-backend-f1os.onrender.com",
    ],
    credentials: true,
  })
);

// ✅ Middlewares
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());

// ✅ Serve uploaded files
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

// ✅ Serve frontend in production
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
