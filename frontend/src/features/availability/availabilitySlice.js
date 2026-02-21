import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDoctorAvailabilityAPI } from "./availabilityAPI";

export const fetchDoctorAvailability = createAsyncThunk(
  "availability/fetchDoctorAvailability",
  async (doctorId) => await getDoctorAvailabilityAPI(doctorId)
);

const availabilitySlice = createSlice({
  name: "availability",
  initialState: {
    dates: [],
    selectedDate: null,
    selectedSlot: null,
    loading: false,
  },
  reducers: {
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
      state.selectedSlot = null;
    },
    setSelectedSlot: (state, action) => {
      state.selectedSlot = action.payload;
    },
    clearSelection: (state) => {
      state.selectedDate = null;
      state.selectedSlot = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctorAvailability.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDoctorAvailability.fulfilled, (state, action) => {
        state.loading = false;
        state.dates = action.payload;
      });
  },
});

export const {
  setSelectedDate,
  setSelectedSlot,
  clearSelection,
} = availabilitySlice.actions;

export default availabilitySlice.reducer;