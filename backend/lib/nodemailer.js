// lib/nodemailer.js (rename the file or create new one)
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create transporter for Gmail
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS, // Your Gmail App Password
  },
});

// Sender configuration
export const sender = {
  email: process.env.EMAIL_USER,
  name: process.env.EMAIL_FROM_NAME || "LinkedIn Clone",
};

// Verify connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email configuration error:", error);
  } else {
    console.log("✅ Email server is ready to send messages");
  }
});