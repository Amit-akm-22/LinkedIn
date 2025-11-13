import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";

// SIGNUP
export const signup = async (req, res) => {
  const { name, username, email, password } = req.body;

  // Send welcome email asynchronously FIRST (fire and forget)
  const sendEmailAsync = async (userEmail, userName, userUsername) => {
    try {
      const profileUrl = `${process.env.CLIENT_URL}/profile/${userUsername}`;
      await sendWelcomeEmail(userEmail, userName, profileUrl);
    } catch (emailError) {
      console.error("Error sending welcome email:", emailError);
    }
  };

  try {
    if (!name || !username || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    if (password.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" });

    const existingEmail = await User.findOne({ email });
    if (existingEmail)
      return res.status(400).json({ message: "Email already exists" });

    const existingUsername = await User.findOne({ username });
    if (existingUsername)
      return res.status(400).json({ message: "Username already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, username, password: hashedPassword });
    await user.save();

    // Create JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" });

    

    res.cookie("jwt-linkedin", token, {
  httpOnly: true,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  sameSite: "none", // ✅ Required for cross-origin
  secure: true, // ✅ Required for production (HTTPS)
});

    // Send response WITHOUT token in body
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
      },
    });

    // Send welcome email after response (non-blocking)
    sendEmailAsync(user.email, user.name, user.username);
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// LOGIN
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" });

    // ✅ Fixed cookie settings for cross-origin
    res.cookie("jwt-linkedin", token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
      sameSite: "none", // ✅ Required for Vercel + Render
      secure: true, // ✅ Always true for production
    });

    res.json({
      message: "Logged in successfully",
    });
  } catch (error) {
    console.error("Error in login controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// LOGOUT
export const logout = (req, res) => {
  res.clearCookie("jwt-linkedin");
  res.json({ message: "Logged out successfully" });
};

// CURRENT USER

// CURRENT USER
export const getCurrentUser = async (req, res) => {
  try {
    // ✅ Fetch user with connections populated
    const user = await User.findById(req.user._id)
      .select("-password") // Exclude password
      .populate("connections", "name username profilePicture headline"); // Populate connections
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error in getCurrentUser:", error);
    res.status(500).json({ message: "Server error" });
  }
};
