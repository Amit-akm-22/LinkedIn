import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
	try {
		console.log("🔍 Incoming cookies:", req.cookies);

		// 1. Get token (cookie OR Authorization header)
		let token = req.cookies?.["jwt-linkedin"];
		if (!token && req.headers.authorization?.startsWith("Bearer ")) {
			token = req.headers.authorization.split(" ")[1];
			console.log("🔍 Token found in Authorization header");
		}

		if (!token) {
			console.log("❌ No token provided (cookie or header missing)");
			return res.status(401).json({ message: "Unauthorized - No Token Provided" });
		}

		console.log("🔍 Token received:", token);

		// 2. Verify token
		let decoded;
		try {
			decoded = jwt.verify(token, process.env.JWT_SECRET);
			console.log("✅ Token decoded:", decoded);
		} catch (err) {
			console.log("❌ Token verification failed:", err.message);
			return res.status(401).json({ message: "Unauthorized - Invalid or Expired Token" });
		}

		// 3. Fetch user
		console.log("🔍 Looking up user with ID:", decoded.userId);
		const user = await User.findById(decoded.userId).select("-password");

		if (!user) {
			console.log("❌ User not found in DB for ID:", decoded.userId);
			return res.status(401).json({ message: "Unauthorized - User not found" });
		}

		console.log("✅ User found:", user.email || user._id);
		req.user = user;

		// 4. Pass control
		next();
	} catch (error) {
		console.error("❌ Error in protectRoute middleware:", error.stack);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};
