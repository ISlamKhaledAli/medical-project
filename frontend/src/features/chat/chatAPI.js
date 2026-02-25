import axiosInstance from "../../api/axiosInstance";
import { ENDPOINTS } from "../../api/endpoints";

const chatAPI = {
    /** Fetch all conversations for the current user */
    fetchConversations: () => axiosInstance.get(ENDPOINTS.CHAT.CONVERSATIONS),

    /** Fetch messages with a specific partner */
    fetchMessages: (partnerId, page = 1) =>
        axiosInstance.get(ENDPOINTS.CHAT.MESSAGES(partnerId), { params: { page } }),

    /** Send a message to a partner (REST fallback) */
    sendMessage: (partnerId, text) =>
        axiosInstance.post(ENDPOINTS.CHAT.SEND(partnerId), { text }),

    /** Mark all messages in a conversation as read */
    markAsRead: (partnerId) =>
        axiosInstance.patch(ENDPOINTS.CHAT.MARK_READ(partnerId)),
};

export default chatAPI;
