import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const senderId = req.user._id;

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userId },
        { senderId: userId, receiverId: myId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("senderId", "name profilePicture")
      .populate("receiverId", "name profilePicture");

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    })
      .sort({ createdAt: -1 })
      .populate("senderId", "name profilePicture headline")
      .populate("receiverId", "name profilePicture headline");

    const conversationsMap = new Map();

    messages.forEach((msg) => {
      const otherUserId =
        msg.senderId._id.toString() === userId.toString()
          ? msg.receiverId._id.toString()
          : msg.senderId._id.toString();

      if (!conversationsMap.has(otherUserId)) {
        const otherUser =
          msg.senderId._id.toString() === userId.toString()
            ? msg.receiverId
            : msg.senderId;

        conversationsMap.set(otherUserId, {
          user: otherUser,
          lastMessage: msg.message,
          lastMessageTime: msg.createdAt,
          unreadCount: 0,
        });
      }

      if (
        msg.receiverId._id.toString() === userId.toString() &&
        !msg.read
      ) {
        conversationsMap.get(otherUserId).unreadCount++;
      }
    });

    const conversations = Array.from(conversationsMap.values());
    res.status(200).json(conversations);
  } catch (error) {
    console.error("Error in getConversations controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};