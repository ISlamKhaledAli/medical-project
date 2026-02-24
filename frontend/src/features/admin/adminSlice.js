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
                state.users = action.payload.users;
                state.pagination = action.payload.pagination;
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
                const index = state.users.findIndex(u => u.id === action.payload.id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
            })
            // Stats
            .addCase(fetchStats.fulfilled, (state, action) => {
                state.stats = action.payload;
            });
    },
});

export default adminSlice.reducer;
