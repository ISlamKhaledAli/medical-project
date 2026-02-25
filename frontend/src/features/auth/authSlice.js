import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authAPI from "./authAPI";

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
            console.error("Registration error details:", error.response?.data);
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

export const updateProfile = createAsyncThunk(
    "auth/updateProfile",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await authAPI.updateProfile(userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to update profile");
        }
    }
);

export const changePassword = createAsyncThunk(
    "auth/changePassword",
    async (passwordData, { rejectWithValue }) => {
        try {
            const response = await authAPI.changePassword(passwordData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to change password");
        }
    }
);

// ==========================
// Initial State
// ==========================
const initialState = {
    user: null,
    accessToken: localStorage.getItem("accessToken") || null,
    isLoading: false, // Core/General loading
    isLoginLoading: false,
    isRegisterLoading: false,
    isAuthChecking: true, // Renamed from isInitialLoading for clarity
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
            state.isAuthChecking = false;
            localStorage.removeItem("accessToken");
        },
        setCredentials: (state, action) => {
            const { user, accessToken } = action.payload;
            if (user) state.user = user;
            // Support both wrapped and direct payloads
            else if (action.payload && !accessToken && action.payload.email) {
                state.user = action.payload;
            }
            if (accessToken) {
                state.accessToken = accessToken;
                localStorage.setItem("accessToken", accessToken);
            }
        },
        clearError: (state) => {
            state.error = null;
            state.successMessage = null;
        },
        stopInitialLoading: (state) => {
            state.isAuthChecking = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(login.pending, (state) => {
                state.isLoginLoading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoginLoading = false;
                state.isAuthChecking = false;
                const payload = action.payload?.data || action.payload;
                state.user = payload?.user || payload;
                state.accessToken = payload?.accessToken || action.payload?.accessToken;
                if (state.accessToken) {
                    localStorage.setItem("accessToken", state.accessToken);
                }
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoginLoading = false;
                state.isAuthChecking = false;
                state.error = action.payload;
            })
            // Register
            .addCase(register.pending, (state) => {
                state.isRegisterLoading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isRegisterLoading = false;
                state.successMessage = action.payload.message || "Registration successful!";
            })
            .addCase(register.rejected, (state, action) => {
                state.isRegisterLoading = false;
                state.error = action.payload;
            })
            // Get Me
            .addCase(getMe.pending, (state) => {
                state.isAuthChecking = true;
            })
            .addCase(getMe.fulfilled, (state, action) => {
                state.isAuthChecking = false;
                const payload = action.payload?.data || action.payload;
                state.user = payload?.user || payload;
            })
            .addCase(getMe.rejected, (state, action) => {
                state.isAuthChecking = false;
                // Only clear if it's clearly an auth failure
                const isAuthError = action.payload === "Unauthorized" ||
                    action.payload === "Session expired" ||
                    (action.error && action.error.message?.includes("401"));

                if (isAuthError) {
                    state.user = null;
                    state.accessToken = null;
                    localStorage.removeItem("accessToken");
                }
            })
            // Update Profile
            .addCase(updateProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.data || action.payload.user || action.payload;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Change Password
            .addCase(changePassword.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(changePassword.fulfilled, (state, action) => {
                state.isLoading = false;
                state.successMessage = action.payload.message || "Password changed successfully";
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Matchers for common auth thunks
            .addMatcher(
                (action) =>
                    action.type.endsWith("/pending") &&
                    [
                        "auth/forgotPassword",
                        "auth/resetPassword",
                        "auth/resendVerification",
                    ].some(v => action.type.startsWith(v)),
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                    state.successMessage = null;
                }
            )
            .addMatcher(
                (action) =>
                    action.type.endsWith("/fulfilled") &&
                    [
                        "auth/forgotPassword",
                        "auth/resetPassword",
                        "auth/resendVerification",
                    ].some(v => action.type.startsWith(v)),
                (state, action) => {
                    state.isLoading = false;
                    state.successMessage = action.payload.message || "Operation successful";
                }
            )
            .addMatcher(
                (action) =>
                    action.type.endsWith("/rejected") &&
                    [
                        "auth/forgotPassword",
                        "auth/resetPassword",
                        "auth/resendVerification",
                    ].some(v => action.type.startsWith(v)),
                (state, action) => {
                    state.isLoading = false;
                    state.error = action.payload;
                }
            );
    },
});

export const { logout, setCredentials, clearError, stopInitialLoading } = authSlice.actions;
export default authSlice.reducer;


