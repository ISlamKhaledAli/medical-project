import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { doctorAPI } from "./doctorAPI";

export const fetchDoctors = createAsyncThunk(
  "doctor/fetchDoctors",
  async (params, { rejectWithValue }) => {
    try {
      return await doctorAPI.getAllDoctors(params);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch doctors",
      );
    }
  },
);

// FIXED 1.1: Added missing fetchDoctorById thunk
export const fetchDoctorById = createAsyncThunk(
  "doctor/fetchDoctorById",
  async (doctorId, { rejectWithValue }) => {
    try {
      return await doctorAPI.getDoctorById(doctorId);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch doctor details",
      );
    }
  },
);

export const fetchSpecialties = createAsyncThunk(
  "doctor/fetchSpecialties",
  async (_, { rejectWithValue }) => {
    try {
      return await doctorAPI.getAllSpecialties();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch specialties",
      );
    }
  },
);

const initialState = {
  doctorsList: [],
  selectedDoctor: null, // FIXED 1.3: Added missing state
  specialtiesList: [],
  pagination: { currentPage: 1, totalPages: 1, totalRecords: 0 },
  loading: false,
  error: null,
  specialtiesLoading: false, // FIXED 1.5: Added specialties loading state
  specialtiesError: null,
};

const doctorSlice = createSlice({
  name: "doctor",
  initialState,
  reducers: {
    // FIXED 1.2: Added missing synchronous action
    clearSelectedDoctor: (state) => {
      state.selectedDoctor = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Doctors
      .addCase(fetchDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.doctorsList = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Single Doctor
      .addCase(fetchDoctorById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctorById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedDoctor = action.payload.data;
      })
      .addCase(fetchDoctorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Specialties
      .addCase(fetchSpecialties.pending, (state) => {
        state.specialtiesLoading = true;
        state.specialtiesError = null;
      })
      .addCase(fetchSpecialties.fulfilled, (state, action) => {
        state.specialtiesLoading = false;
        state.specialtiesList = action.payload.data;
      })
      .addCase(fetchSpecialties.rejected, (state, action) => {
        // FIXED 1.4: Added error handling
        state.specialtiesLoading = false;
        state.specialtiesError = action.payload;
      });
  },
});

export const { clearSelectedDoctor } = doctorSlice.actions;
export default doctorSlice.reducer;
