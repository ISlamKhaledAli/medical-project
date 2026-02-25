import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import appointmentAPI from "./appointmentAPI";

export const fetchMyAppointments = createAsyncThunk(
    "appointment/fetchMy",
    async (_, { rejectWithValue }) => {
        try {
            const response = await appointmentAPI.fetchMy();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch appointments");
        }
    }
);

export const createAppointment = createAsyncThunk(
    "appointment/create",
    async (data, { rejectWithValue }) => {
        try {
            const response = await appointmentAPI.create(data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Booking failed");
        }
    }
);

export const cancelAppointment = createAsyncThunk(
    "appointment/cancel",
    async (id, { rejectWithValue }) => {
        try {
            const response = await appointmentAPI.cancel(id);
            return { id, data: response.data };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Cancellation failed");
        }
    }
);

export const rescheduleAppointment = createAsyncThunk(
    "appointment/reschedule",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await appointmentAPI.reschedule(id, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Rescheduling failed");
        }
    }
);

export const updateAppointmentStatus = createAsyncThunk(
    "appointment/updateStatus",
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const response = await appointmentAPI.updateStatus(id, status);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Status update failed");
        }
    }
);

const initialState = {
    appointments: [],
    isLoading: false,
    isActionLoading: false, // For specific actions like cancel/book
    error: null,
};

const appointmentSlice = createSlice({
    name: "appointment",
    initialState,
    reducers: {
        clearAppointmentError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchMyAppointments.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchMyAppointments.fulfilled, (state, action) => {
                state.isLoading = false;
                state.appointments = action.payload.data || [];
            })
            .addCase(fetchMyAppointments.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Create
            .addCase(createAppointment.pending, (state) => {
                state.isActionLoading = true;
                state.error = null;
            })
            .addCase(createAppointment.fulfilled, (state, action) => {
                state.isActionLoading = false;
                const newAppt = action.payload.data || action.payload;
                state.appointments.unshift(newAppt);
            })
            .addCase(createAppointment.rejected, (state, action) => {
                state.isActionLoading = false;
                state.error = action.payload;
            })
            // Cancel
            .addCase(cancelAppointment.pending, (state) => {
                state.isActionLoading = true;
            })
            .addCase(cancelAppointment.fulfilled, (state, action) => {
                state.isActionLoading = false;
                const index = state.appointments.findIndex(a => a._id === (action.payload.data?._id || action.payload.id));
                if (index !== -1) {
                    state.appointments[index].status = 'cancelled';
                }
            })
            .addCase(cancelAppointment.rejected, (state, action) => {
                state.isActionLoading = false;
                state.error = action.payload;
            })
            // Reschedule
            .addCase(rescheduleAppointment.pending, (state) => {
                state.isActionLoading = true;
            })
            .addCase(rescheduleAppointment.fulfilled, (state, action) => {
                state.isActionLoading = false;
                const updatedData = action.payload.data || action.payload;
                const index = state.appointments.findIndex(a => a._id === (updatedData._id || updatedData.id));

                if (index !== -1) {
                    state.appointments[index].appointmentDate = updatedData.appointmentDate;
                    state.appointments[index].startTime = updatedData.startTime;
                    state.appointments[index].endTime = updatedData.endTime;
                    state.appointments[index].status = 'pending'; // Reset status if it changes on reschedule
                }
            })
            .addCase(rescheduleAppointment.rejected, (state, action) => {
                state.isActionLoading = false;
                state.error = action.payload;
            })
            // Update Status (Doctor/Admin)
            .addCase(updateAppointmentStatus.pending, (state) => {
                state.isActionLoading = true;
            })
            .addCase(updateAppointmentStatus.fulfilled, (state, action) => {
                state.isActionLoading = false;
                const updatedAppt = action.payload.data || action.payload;
                const index = state.appointments.findIndex(a => a._id === updatedAppt._id || a.id === updatedAppt.id);
                if (index !== -1) {
                    state.appointments[index] = updatedAppt;
                }
            })
            .addCase(updateAppointmentStatus.rejected, (state, action) => {
                state.isActionLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearAppointmentError } = appointmentSlice.actions;
export default appointmentSlice.reducer;
