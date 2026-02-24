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
    isActionLoading: false,
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
                    totalItems: action.payload.total || 0
                };
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Status Toggle (Optimistic)
            .addCase(toggleUserStatus.pending, (state) => {
                state.isActionLoading = true;
            })
            .addCase(toggleUserStatus.fulfilled, (state, action) => {
                state.isActionLoading = false;
                const user = action.payload.data;
                const index = state.users.findIndex(u => u._id === user._id);
                if (index !== -1) {
                    state.users[index] = user;
                }
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
                    totalItems: action.payload.total || 0
                };
            })
            .addCase(fetchAllAppointments.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Stats
            .addCase(fetchStats.fulfilled, (state, action) => {
                state.stats = action.payload.data;
            });
    },
});

export default adminSlice.reducer;
