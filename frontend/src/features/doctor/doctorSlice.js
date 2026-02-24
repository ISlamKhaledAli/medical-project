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
            state.pagination.page = 1; // Reset to page 1 on filter change
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
                state.doctors = action.payload.doctors;
                state.pagination = action.payload.pagination || state.pagination;
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
                state.doctorDetails = action.payload;
            })
            .addCase(fetchDoctorById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { setFilters, setPage, clearDoctorDetails } = doctorSlice.actions;
export default doctorSlice.reducer;
