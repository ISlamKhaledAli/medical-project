import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const fetchDoctors = createAsyncThunk(
    "doctor/fetchDoctors",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/doctors");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch doctors");
        }
    }
);

const initialState = {
    doctors: [],
    isLoading: false,
    error: null,
};

const doctorSlice = createSlice({
    name: "doctor",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDoctors.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchDoctors.fulfilled, (state, action) => {
                state.isLoading = false;
                state.doctors = action.payload;
            })
            .addCase(fetchDoctors.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export default doctorSlice.reducer;
