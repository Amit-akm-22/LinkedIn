import { transporter, sender } from "../lib/nodemailer.js";
import {
  createCommentNotificationEmailTemplate,
  createConnectionAcceptedEmailTemplate,
  createWelcomeEmailTemplate,
} from "./emailTemplates.js";

export const sendWelcomeEmail = async (email, name, profileUrl) => {
  try {
    const mailOptions = {
      from: `${sender.name} <${sender.email}>`,
      to: email,
      subject: "Welcome to UnLinked",
      html: createWelcomeEmailTemplate(name, profileUrl),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Welcome Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Error sending welcome email:", error);
    throw error;
  }
};

export const sendCommentNotificationEmail = async (
  recipientEmail,
  recipientName,
  commenterName,
  postUrl,
  commentContent
) => {
  try {
    const mailOptions = {
      from: `${sender.name} <${sender.email}>`,
      to: recipientEmail,
      subject: "New Comment on Your Post",
      html: createCommentNotificationEmailTemplate(
        recipientName,
        commenterName,
        postUrl,
        commentContent
      ),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Comment Notification Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Error sending comment notification email:", error);
    throw error;
  }
};

export const sendConnectionAcceptedEmail = async (
  senderEmail,
  senderName,
  recipientName,
  profileUrl
) => {
  try {
    const mailOptions = {
      from: `${sender.name} <${sender.email}>`,
      to: senderEmail,
      subject: `${recipientName} accepted your connection request`,
      html: createConnectionAcceptedEmailTemplate(
        senderName,
        recipientName,
        profileUrl
      ),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Connection Accepted Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Error sending connection accepted email:", error);
    throw error;
  }
};