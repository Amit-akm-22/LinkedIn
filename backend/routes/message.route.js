import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { 
  sendMessage, 
  getMessages, 
  getConversations 
} from "../controllers/message.controller.js";

const router = express.Router();

router.post("/send", protectRoute, sendMessage);
router.get("/:userId", protectRoute, getMessages);
router.get("/conversations/all", protectRoute, getConversations);

export default router;