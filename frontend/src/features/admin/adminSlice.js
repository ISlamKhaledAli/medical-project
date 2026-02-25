import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adminAPI from "./adminAPI";

export const fetchUsers = createAsyncThunk(
    "admin/fetchUsers",
    async (params, { rejectWithValue }) => {
        try {
            const response = await adminAPI.fetchUsers(params);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch users");
        }
    }
);

export const toggleUserStatus = createAsyncThunk(
    "admin/toggleStatus",
    async ({ id, status }, { rejectWithValue }) => {
        try {
            console.log(`[Thunk:toggleUserStatus] ID: ${id}, Status: ${status}`);
            const response = await adminAPI.toggleUserStatus(id, status);
            console.log(`[Thunk:toggleUserStatus] Success response:`, response.data);
            return response.data;
        } catch (error) {
            console.error(`[Thunk:toggleUserStatus] Error:`, error.response?.data);
            return rejectWithValue(error.response?.data?.message || "Action failed");
        }
    }
);

export const fetchAllAppointments = createAsyncThunk(
    "admin/fetchAllAppointments",
    async (params, { rejectWithValue }) => {
        try {
            const response = await adminAPI.fetchAllAppointments(params);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch appointments");
        }
    }
);

export const fetchStats = createAsyncThunk(
    "admin/fetchStats",
    async (_, { rejectWithValue }) => {
        try {
            const response = await adminAPI.fetchStats();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch statistics");
        }
    }
);

const initialState = {
    users: [],
    appointments: [],
    stats: null,
    isLoading: false,
    isActionLoading: false, // Per-action global loading (legacy/general)
    actionLoadingStates: {}, // Per-ID loading: { [id]: true }
    error: null,
    pagination: {
        page: 1,
        totalPages: 1,
        totalItems: 0
    }
};

const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        clearAdminError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Users Fetching
            .addCase(fetchUsers.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                const payload = action.payload;
                state.users = Array.isArray(payload.data) ? payload.data : [];
                state.pagination = {
                    page: payload.page || 1,
                    totalPages: payload.pages || 1,
                    totalItems: payload.totalItems || payload.total || 0
                };
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Status Toggle (Optimistic Update)
            .addCase(toggleUserStatus.pending, (state, action) => {
                const { id, status } = action.meta.arg;
                state.actionLoadingStates[id] = true;

                // Create a backup of the user for rollback
                const userIndex = state.users.findIndex(u => u._id === id);
                if (userIndex !== -1) {
                    const user = state.users[userIndex];
                    // Store original state in meta if we were using a custom middleware, 
                    // but for now we'll just handle basic rollback in rejected case.

                    // Apply optimistic change
                    if (status === "approved" || status === "rejected") {
                        user.status = status;
                    } else if (status === "blocked") {
                        user.isBlocked = true;
                    } else if (status === "active") {
                        user.isBlocked = false;
                    }
                }
            })
            .addCase(toggleUserStatus.fulfilled, (state, action) => {
                const updatedUser = action.payload.data || action.payload;
                if (!updatedUser?._id) return;

                delete state.actionLoadingStates[updatedUser._id];

                const index = state.users.findIndex(u => u._id === updatedUser._id);
                if (index !== -1) {
                    state.users[index] = updatedUser;
                }
            })
            .addCase(toggleUserStatus.rejected, (state, action) => {
                const { id, status } = action.meta.arg;
                delete state.actionLoadingStates[id];
                state.error = action.payload;

                // Rollback optimistic update
                const user = state.users.find(u => u._id === id);
                if (user) {
                    if (status === "approved" || status === "rejected") {
                        user.status = "pending";
                    } else if (status === "blocked") {
                        user.isBlocked = false;
                    } else if (status === "active") {
                        user.isBlocked = true;
                    }
                }
            })
            // Appointments
            .addCase(fetchAllAppointments.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAllAppointments.fulfilled, (state, action) => {
                state.isLoading = false;
                const payload = action.payload;
                state.appointments = Array.isArray(payload.data) ? payload.data : [];
                state.pagination = {
                    page: payload.page || 1,
                    totalPages: payload.pages || 1,
                    totalItems: payload.totalItems || payload.total || 0
                };
            })
            .addCase(fetchAllAppointments.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Stats
            .addCase(fetchStats.pending, (state) => {
                state.error = null;
            })
            .addCase(fetchStats.fulfilled, (state, action) => {
                state.stats = action.payload.data || action.payload;
            });
    },
});

export const { clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;
