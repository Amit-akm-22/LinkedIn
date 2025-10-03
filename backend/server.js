import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import notificationRoutes from "./routes/notification.route.js";
import connectionRoutes from "./routes/connection.route.js";

import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// ✅ Step 1: CORS setup


const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true, // important
};

app.use(cors(corsOptions));

// ✅ Step 2: Middlewares
app.use(express.json({ limit: "5mb" })); // parse JSON
app.use(cookieParser()); // parse cookies

// ✅ Step 3: API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/connections", connectionRoutes);

// ✅ Step 4: Serve frontend in production
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

// ✅ Step 5: Start server + DB
app.listen(PORT, () => {
	console.log(`🚀 Server running on port ${PORT}`);
	connectDB();
});
