import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAppointmentsAPI,
  createAppointmentAPI,
  cancelAppointmentAPI,
} from "./appointmentAPI";

/* ================= FETCH ================= */

export const fetchAppointments = createAsyncThunk(
  "appointment/fetchAppointments",
  async (_, { rejectWithValue }) => {
    try {
      return await getAppointmentsAPI();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch appointments"
      );
    }
  }
);

/* ================= CREATE ================= */

export const createAppointment = createAsyncThunk(
  "appointment/createAppointment",
  async (body, { rejectWithValue }) => {
    try {
      return await createAppointmentAPI(body);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create appointment"
      );
    }
  }
);

/* ================= CANCEL ================= */

export const cancelAppointment = createAsyncThunk(
  "appointment/cancelAppointment",
  async (id, { rejectWithValue }) => {
    try {
      return await cancelAppointmentAPI(id);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to cancel appointment"
      );
    }
  }
);

const initialState = {
  appointments: [],
  isLoading: false,
  error: null,
  bookingSuccess: false,
};

const appointmentSlice = createSlice({
  name: "appointment",
  initialState,
  reducers: {
    resetBookingState: (state) => {
      state.bookingSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* FETCH */
      .addCase(fetchAppointments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.appointments = action.payload;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      /* CREATE */
      .addCase(createAppointment.pending, (state) => {
        state.isLoading = true;
        state.bookingSuccess = false;
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookingSuccess = true;
        state.appointments.unshift(action.payload);
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      /* CANCEL */
      .addCase(cancelAppointment.fulfilled, (state, action) => {
        const index = state.appointments.findIndex(
          (a) => a._id === action.payload._id
        );
        if (index !== -1) {
          state.appointments[index] = action.payload;
        }
      });
  },
});

export const { resetBookingState } = appointmentSlice.actions;

export default appointmentSlice.reducer;