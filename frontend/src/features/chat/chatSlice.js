import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import chatAPI from "./chatAPI";

// ─── Async Thunks ──────────────────────────────────────

export const fetchConversations = createAsyncThunk(
    "chat/fetchConversations",
    async (_, { rejectWithValue }) => {
        try {
            const res = await chatAPI.fetchConversations();
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to load conversations");
        }
    }
);

export const fetchMessages = createAsyncThunk(
    "chat/fetchMessages",
    async ({ partnerId, page = 1 }, { rejectWithValue }) => {
        try {
            const res = await chatAPI.fetchMessages(partnerId, page);
            return { partnerId, ...res.data.data };
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to load messages");
        }
    }
);

export const sendMessageThunk = createAsyncThunk(
    "chat/sendMessage",
    async ({ partnerId, text }, { rejectWithValue }) => {
        try {
            const res = await chatAPI.sendMessage(partnerId, text);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to send message");
        }
    }
);

export const markConversationRead = createAsyncThunk(
    "chat/markRead",
    async (partnerId, { rejectWithValue }) => {
        try {
            await chatAPI.markAsRead(partnerId);
            return partnerId;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to mark as read");
        }
    }
);

// ─── Slice ─────────────────────────────────────────────

const initialState = {
    conversations: [],
    activePartnerId: null,
    messages: [],
    totalMessages: 0,
    currentPage: 1,
    totalPages: 1,
    isLoadingConversations: false,
    isLoadingMessages: false,
    isSending: false,
    typingUsers: {}, // { [userId]: true }
};

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setActivePartner: (state, action) => {
            state.activePartnerId = action.payload;
            state.messages = [];
            state.currentPage = 1;
            state.totalPages = 1;
        },

        /** Called when a real-time message arrives via Socket.IO */
        addIncomingMessage: (state, action) => {
            const msg = action.payload;
            // Avoid duplicates
            const exists = state.messages.find((m) => m._id === msg._id);
            if (!exists) {
                state.messages.push(msg);
            }

            // Update conversation preview
            const senderId = msg.sender?._id || msg.sender;
            const receiverId = msg.receiver?._id || msg.receiver;
            const partnerId = senderId === state.activePartnerId ? senderId : receiverId;

            const conv = state.conversations.find((c) => c.partnerId === senderId || c.partnerId === receiverId);
            if (conv) {
                conv.lastMessage = {
                    text: msg.text,
                    createdAt: msg.createdAt,
                    senderId: senderId,
                };
                // If message is from someone else and we're not viewing that conversation
                if (partnerId !== state.activePartnerId) {
                    conv.unreadCount = (conv.unreadCount || 0) + 1;
                }
            }
        },

        setTyping: (state, action) => {
            state.typingUsers[action.payload] = true;
        },

        clearTyping: (state, action) => {
            delete state.typingUsers[action.payload];
        },

        clearMessagesRead: (state, action) => {
            const partnerId = action.payload;
            const conv = state.conversations.find((c) => c.partnerId === partnerId);
            if (conv) {
                conv.unreadCount = 0;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // Conversations
            .addCase(fetchConversations.pending, (state) => {
                state.isLoadingConversations = true;
            })
            .addCase(fetchConversations.fulfilled, (state, action) => {
                state.isLoadingConversations = false;
                state.conversations = action.payload;
            })
            .addCase(fetchConversations.rejected, (state) => {
                state.isLoadingConversations = false;
            })
            // Messages
            .addCase(fetchMessages.pending, (state) => {
                state.isLoadingMessages = true;
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.isLoadingMessages = false;
                const { messages, total, page, pages } = action.payload;
                if (page === 1) {
                    state.messages = messages;
                } else {
                    // Prepend older messages
                    state.messages = [...messages, ...state.messages];
                }
                state.totalMessages = total;
                state.currentPage = page;
                state.totalPages = pages;
            })
            .addCase(fetchMessages.rejected, (state) => {
                state.isLoadingMessages = false;
            })
            // Send
            .addCase(sendMessageThunk.pending, (state) => {
                state.isSending = true;
            })
            .addCase(sendMessageThunk.fulfilled, (state) => {
                state.isSending = false;
                // The actual message will arrive via socket event (addIncomingMessage)
            })
            .addCase(sendMessageThunk.rejected, (state) => {
                state.isSending = false;
            })
            // Mark read
            .addCase(markConversationRead.fulfilled, (state, action) => {
                const conv = state.conversations.find((c) => c.partnerId === action.payload);
                if (conv) conv.unreadCount = 0;
            });
    },
});

export const {
    setActivePartner,
    addIncomingMessage,
    setTyping,
    clearTyping,
    clearMessagesRead,
} = chatSlice.actions;

export default chatSlice.reducer;
