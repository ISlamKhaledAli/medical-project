import { Router } from "express";
import {
    getConversationsHandler,
    getMessagesHandler,
    sendMessageHandler,
    markAsReadHandler,
} from "../controllers/chat.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

// All chat routes require authentication
router.use(protect);

// GET  /api/chat/conversations   – list all conversations
router.get("/conversations", getConversationsHandler);

// GET  /api/chat/:partnerId      – get messages with a partner
router.get("/:partnerId", getMessagesHandler);

// POST /api/chat/:partnerId      – send a message to a partner
router.post("/:partnerId", sendMessageHandler);

// PATCH /api/chat/:partnerId/read – mark conversation as read
router.patch("/:partnerId/read", markAsReadHandler);

export default router;
