import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authAPI from "./authAPI";
import { startGlobalLoading, stopGlobalLoading } from "../ui/uiSlice";

// ==========================
// Async Thunks
// ==========================

export const login = createAsyncThunk(
    "auth/login",
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await authAPI.login(credentials);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Login failed");
        }
    }
);

export const register = createAsyncThunk(
    "auth/register",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await authAPI.register(userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Registration failed");
        }
    }
);

export const getMe = createAsyncThunk(
    "auth/getMe",
    async (_, { rejectWithValue }) => {
        try {
            const response = await authAPI.getMe();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Unauthorized");
        }
    }
);

export const logoutUser = createAsyncThunk(
    "auth/logoutUser",
    async (_, { dispatch, rejectWithValue }) => {
        try {
            await authAPI.logout();
            dispatch(logout());
            return true;
        } catch (error) {
            dispatch(logout());
            return rejectWithValue(error.response?.data?.message || "Logout failed");
        }
    }
);

export const forgotPassword = createAsyncThunk(
    "auth/forgotPassword",
    async (email, { rejectWithValue }) => {
        try {
            const response = await authAPI.forgotPassword(email);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Action failed");
        }
    }
);

export const resetPassword = createAsyncThunk(
    "auth/resetPassword",
    async (data, { rejectWithValue }) => {
        try {
            const response = await authAPI.resetPassword(data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Reset failed");
        }
    }
);

export const resendVerification = createAsyncThunk(
    "auth/resendVerification",
    async (email, { rejectWithValue }) => {
        try {
            const response = await authAPI.resendVerification(email);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to resend");
        }
    }
);

// ==========================
// Initial State
// ==========================
const initialState = {
    user: null,
    accessToken: localStorage.getItem("accessToken") || null,
    isLoading: false,
    isInitialLoading: true, // For preventing flash during app start
    error: null,
    successMessage: null,
};

// ==========================
// Slice
// ==========================
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.accessToken = null;
            localStorage.removeItem("accessToken");
        },
        setCredentials: (state, action) => {
            const { user, accessToken } = action.payload;
            if (user) state.user = user;
            state.accessToken = accessToken;
            localStorage.setItem("accessToken", accessToken);
        },
        clearError: (state) => {
            state.error = null;
            state.successMessage = null;
        },
        stopInitialLoading: (state) => {
            state.isInitialLoading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
                localStorage.setItem("accessToken", action.payload.accessToken);
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Register
            .addCase(register.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
                localStorage.setItem("accessToken", action.payload.accessToken);
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Get Me
            .addCase(getMe.pending, (state) => {
                state.error = null;
            })
            .addCase(getMe.fulfilled, (state, action) => {
                state.isInitialLoading = false;
                state.user = action.payload.user;
            })
            .addCase(getMe.rejected, (state) => {
                state.isInitialLoading = false;
                state.user = null;
                state.accessToken = null;
                localStorage.removeItem("accessToken");
            })
            // Password Recovery & Verification
            .addMatcher(
                (action) =>
                    [
                        forgotPassword.pending,
                        resetPassword.pending,
                        resendVerification.pending,
                    ].includes(action.type),
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                    state.successMessage = null;
                }
            )
            .addMatcher(
                (action) =>
                    [
                        forgotPassword.fulfilled,
                        resetPassword.fulfilled,
                        resendVerification.fulfilled,
                    ].includes(action.type),
                (state, action) => {
                    state.isLoading = false;
                    state.successMessage = action.payload.message || "Operation successful";
                }
            )
            .addMatcher(
                (action) =>
                    [
                        forgotPassword.rejected,
                        resetPassword.rejected,
                        resendVerification.rejected,
                    ].includes(action.type),
                (state, action) => {
                    state.isLoading = false;
                    state.error = action.payload;
                }
            );
    },
});

export const { logout, setCredentials, clearError } = authSlice.actions;
export default authSlice.reducer;