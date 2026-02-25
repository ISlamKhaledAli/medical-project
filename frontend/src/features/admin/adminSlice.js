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
            const response = await adminAPI.toggleUserStatus(id, status);
            return response.data;
        } catch (error) {
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
    isActionLoading: false, // Legacy global loading
    actionLoadingStates: {}, // Per-row loading: { [id]: true }
    error: null,
    pagination: {
        page: 1,
        totalPages: 1
    }
};

const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Users
            .addCase(fetchUsers.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.users = Array.isArray(action.payload.data) ? action.payload.data : [];
                state.pagination = {
                    page: action.payload.page || 1,
                    totalPages: action.payload.pages || 1,
                    totalItems: action.payload.totalItems || action.payload.total || 0
                };
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Status Toggle (True Optimistic Update)
            .addCase(toggleUserStatus.pending, (state, action) => {
                state.isActionLoading = true;
                const { id, status } = action.meta.arg;
                state.actionLoadingStates[id] = true;

                // Optimistically update the user in the state
                const user = state.users.find(u => u._id === id);
                if (user) {
                    if (status === "approved" || status === "rejected") {
                        user.status = status;
                    } else if (status === "blocked" || status === "active") {
                        user.isBlocked = status === "blocked";
                    }
                }
            })
            .addCase(toggleUserStatus.fulfilled, (state, action) => {
                state.isActionLoading = false;
                const updatedUser = action.payload.data;
                if (!updatedUser) return;

                // Clear per-row loading
                delete state.actionLoadingStates[updatedUser._id];

                const index = state.users.findIndex(u => u._id === updatedUser._id);
                if (index !== -1) {
                    // If the user's status is no longer 'pending', remove from the users list
                    // (The component filters locally, but this keeps the global state clean)
                    if (updatedUser.role === "doctor" && updatedUser.status !== "pending") {
                        state.users.splice(index, 1);
                    } else {
                        state.users[index] = updatedUser;
                    }
                }
            })
            .addCase(toggleUserStatus.rejected, (state, action) => {
                state.isActionLoading = false;
                const { id, status } = action.meta?.arg || {};
                const errorMessage = action.payload;

                if (id) {
                    delete state.actionLoadingStates[id];

                    // If backend says they are ALREADY processed or NOT a doctor, we sync UI by removing them
                    const isInvalidOrProcessed =
                        (status === "approved" && errorMessage?.includes("already approved")) ||
                        (status === "rejected" && errorMessage?.includes("already rejected")) ||
                        (errorMessage?.includes("not a doctor"));

                    if (isInvalidOrProcessed) {
                        const index = state.users.findIndex(u => u._id === id);
                        if (index !== -1) state.users.splice(index, 1);
                    } else {
                        // Regular rollback for legitimate failures
                        const user = state.users.find(u => u._id === id);
                        if (user) {
                            if (status === "approved" || status === "rejected") {
                                user.status = "pending";
                            } else if (status === "blocked" || status === "active") {
                                user.isBlocked = status !== "blocked";
                            }
                        }
                    }
                }
                state.error = action.payload;
            })
            // Appointments
            .addCase(fetchAllAppointments.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchAllAppointments.fulfilled, (state, action) => {
                state.isLoading = false;
                state.appointments = Array.isArray(action.payload.data) ? action.payload.data : [];
                state.pagination = {
                    page: action.payload.page || 1,
                    totalPages: action.payload.pages || 1,
                    totalItems: action.payload.totalItems || action.payload.total || 0
                };
            })
            .addCase(fetchAllAppointments.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Stats
            .addCase(fetchStats.fulfilled, (state, action) => {
                state.stats = action.payload.data || action.payload;
            });
    },
});

export default adminSlice.reducer;
