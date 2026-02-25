import wrapAsync from "../middleware/asyncHandler.js";
import {
    getMyConversations,
    getConversation,
    sendMessage,
    markConversationAsRead,
} from "../services/chat.service.js";

/**
 * GET /api/chat/conversations
 * Get all conversations for the logged-in user.
 */
export const getConversationsHandler = wrapAsync(async (req, res) => {
    const conversations = await getMyConversations(
        req.user._id.toString(),
        req.user.role
    );
    res.json({ success: true, data: conversations });
});

/**
 * GET /api/chat/:partnerId
 * Get messages between current user and a specific partner.
 */
export const getMessagesHandler = wrapAsync(async (req, res) => {
    const { partnerId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;

    const result = await getConversation(
        req.user._id.toString(),
        partnerId,
        page,
        limit
    );
    res.json({ success: true, data: result });
});

/**
 * POST /api/chat/:partnerId
 * Send a message to a partner.
 */
export const sendMessageHandler = wrapAsync(async (req, res) => {
    const { partnerId } = req.params;
    const { text } = req.body;

    const message = await sendMessage(
        req.user._id.toString(),
        partnerId,
        text
    );
    res.status(201).json({ success: true, data: message });
});

/**
 * PATCH /api/chat/:partnerId/read
 * Mark all messages from partner as read.
 */
export const markAsReadHandler = wrapAsync(async (req, res) => {
    const { partnerId } = req.params;
    const result = await markConversationAsRead(
        req.user._id.toString(),
        partnerId
    );
    res.json({ success: true, data: result });
});
