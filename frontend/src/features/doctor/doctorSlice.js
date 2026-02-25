import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import doctorAPI from "./doctorAPI";

// ==========================
// Async Thunks
// ==========================

export const fetchDoctors = createAsyncThunk(
    "doctor/fetchDoctors",
    async (params, { rejectWithValue }) => {
        try {
            const response = await doctorAPI.fetchDoctors(params);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch doctors");
        }
    }
);

export const fetchDoctorById = createAsyncThunk(
    "doctor/fetchDoctorById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await doctorAPI.fetchDoctorById(id);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch doctor details");
        }
    }
);

export const fetchMyProfile = createAsyncThunk(
    "doctor/fetchMyProfile",
    async (_, { rejectWithValue }) => {
        try {
            const response = await doctorAPI.fetchMyProfile();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch profile");
        }
    }
);

export const createDoctorProfile = createAsyncThunk(
    "doctor/createProfile",
    async (data, { rejectWithValue }) => {
        try {
            const response = await doctorAPI.createProfile(data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to create profile");
        }
    }
);

export const updateDoctorProfile = createAsyncThunk(
    "doctor/updateProfile",
    async (data, { rejectWithValue }) => {
        try {
            const response = await doctorAPI.updateProfile(data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to update profile");
        }
    }
);

// ==========================
// Initial State
// ==========================

const initialState = {
    doctors: [],
    doctorDetails: null,
    isLoading: false,
    error: null,
    pagination: {
        page: 1,
        limit: 10,
        totalPages: 1,
        totalCount: 0,
    },
    filters: {
        name: "",
        specialty: "",
    },
    stats: {
        today: 0,
        pending: 0,
        completed: 0,
    },
};

// ==========================
// Slice
// ==========================

const doctorSlice = createSlice({
    name: "doctor",
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
            state.pagination.page = 1;
        },
        setNameFilter: (state, action) => {
            state.filters.name = action.payload;
            state.pagination.page = 1;
        },
        setSpecialtyFilter: (state, action) => {
            state.filters.specialty = action.payload;
            state.pagination.page = 1;
        },
        setPage: (state, action) => {
            state.pagination.page = action.payload;
        },
        clearDoctorDetails: (state) => {
            state.doctorDetails = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Doctors
            .addCase(fetchDoctors.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchDoctors.fulfilled, (state, action) => {
                state.isLoading = false;
                state.doctors = action.payload.data || [];
                state.pagination = {
                    page: action.payload.page || 1,
                    totalPages: action.payload.pages || 1,
                    totalCount: action.payload.total || 0,
                    limit: state.pagination.limit
                };
            })
            .addCase(fetchDoctors.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Fetch Doctor By ID
            .addCase(fetchDoctorById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchDoctorById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.doctorDetails = action.payload.data || action.payload;
            })
            .addCase(fetchDoctorById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Fetch My Profile
            .addCase(fetchMyProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchMyProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.doctorDetails = action.payload.data || action.payload;
            })
            .addCase(fetchMyProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Create Profile
            .addCase(createDoctorProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createDoctorProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.doctorDetails = action.payload.data || action.payload;
                // Reactive update for AppRoutes guard
                if (action.payload.data?.user) {
                    // This assumes state.auth is handled elsewhere, but we can set a flag here 
                    // or the user will rely on the next fetch. 
                    // Actually, we should probably update state.auth if possible, 
                    // but slices are isolated. 
                    // Usually, we'd handle this in a root reducer or by re-fetching 'getMe'.
                }
            })
            .addCase(createDoctorProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Update Profile
            .addCase(updateDoctorProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateDoctorProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.doctorDetails = action.payload.data || action.payload;
            })
            .addCase(updateDoctorProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { setFilters, setNameFilter, setSpecialtyFilter, setPage, clearDoctorDetails } = doctorSlice.actions;
export default doctorSlice.reducer;
