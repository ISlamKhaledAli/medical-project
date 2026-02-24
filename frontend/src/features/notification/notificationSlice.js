import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import notificationAPI from "./notificationAPI";

export const fetchNotifications = createAsyncThunk(
    "notification/fetch",
    async (_, { rejectWithValue }) => {
        try {
            const response = await notificationAPI.fetchNotifications();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch notifications");
        }
    }
);

export const markAsRead = createAsyncThunk(
    "notification/markRead",
    async (id, { rejectWithValue }) => {
        try {
            await notificationAPI.markAsRead(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to mark as read");
        }
    }
);

export const markAllNotificationsAsRead = createAsyncThunk(
    "notification/markAllRead",
    async (_, { rejectWithValue }) => {
        try {
            await notificationAPI.markAllAsRead();
            return null;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to mark all as read");
        }
    }
);

const initialState = {
    notifications: [],
    unreadCount: 0,
    isLoading: false,
};

const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        addNotification: (state, action) => {
            state.notifications.unshift(action.payload);
            state.unreadCount += 1;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.isLoading = false;
                const notifications = Array.isArray(action.payload) ? action.payload : [];
                state.notifications = notifications;
                state.unreadCount = notifications.filter(n => !n.isRead).length;
            })
            .addCase(markAsRead.fulfilled, (state, action) => {
                const index = state.notifications.findIndex(n => n.id === action.payload);
                if (index !== -1 && !state.notifications[index].isRead) {
                    state.notifications[index].isRead = true;
                    state.unreadCount = Math.max(0, state.unreadCount - 1);
                }
            })
            .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
                state.notifications = state.notifications.map(n => ({ ...n, isRead: true }));
                state.unreadCount = 0;
            });
    },
});

export const { addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
