import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import doctorAPI from "./doctorAPI";

// ==========================
// Async Thunks
// ==========================

export const fetchSpecialties = createAsyncThunk(
    "specialty/fetchSpecialties",
    async (_, { rejectWithValue }) => {
        try {
            const response = await doctorAPI.fetchSpecialties();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch specialties");
        }
    }
);

// ==========================
// Initial State
// ==========================

const initialState = {
    specialties: [],
    isLoading: false,
    error: null,
};

// ==========================
// Slice
// ==========================

const specialtySlice = createSlice({
    name: "specialty",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSpecialties.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchSpecialties.fulfilled, (state, action) => {
                state.isLoading = false;
                state.specialties = action.payload;
            })
            .addCase(fetchSpecialties.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export default specialtySlice.reducer;
