import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import availabilityAPI from "./availabilityAPI";

/**
 * Fetch doctor's availability slots and working days
 */
export const fetchDoctorSchedule = createAsyncThunk(
    "availability/fetchSchedule",
    async ({ doctorId, date, excludeAppointmentId }, { rejectWithValue }) => {
        try {
            const response = await availabilityAPI.fetchSlots(doctorId, date, excludeAppointmentId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch schedule");
        }
    }
);

// Keep fetchDoctorAvailability as an alias or migration path if needed, 
// but we'll use fetchDoctorSchedule going forward.
export const fetchDoctorAvailability = fetchDoctorSchedule;

export const createAvailability = createAsyncThunk(
    "availability/create",
    async (data, { rejectWithValue }) => {
        try {
            const response = await availabilityAPI.create(data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Creation failed");
        }
    }
);

export const updateAvailability = createAsyncThunk(
    "availability/update",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await availabilityAPI.update(id, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Update failed");
        }
    }
);

export const deleteAvailability = createAsyncThunk(
    "availability/delete",
    async (id, { rejectWithValue }) => {
        try {
            await availabilityAPI.delete(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Deletion failed");
        }
    }
);

export const saveWeeklySchedule = createAsyncThunk(
    "availability/saveWeekly",
    async (days, { rejectWithValue }) => {
        try {
            const response = await availabilityAPI.saveWeekly(days);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to save schedule");
        }
    }
);

const initialState = {
    slots: [], // For patient-side slot picking
    workingDays: [], // Array of dayOfWeek numbers (0-6)
    weeklySchedule: [], // For doctor-side schedule management (raw records)
    loading: false,
    isActionLoading: false,
    isScheduleLoaded: false, // Track if we've successfully fetched the doctor's working days
    error: null,
};

const availabilitySlice = createSlice({
    name: "availability",
    initialState,
    reducers: {
        clearSlots: (state) => {
            state.slots = [];
        },
        clearSchedule: (state) => {
            state.slots = [];
            state.workingDays = [];
            state.isScheduleLoaded = false;
            state.error = null;
        },
        clearAvailabilityError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Schedule (Slots + Working Days)
            .addCase(fetchDoctorSchedule.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDoctorSchedule.fulfilled, (state, action) => {
                state.loading = false;
                const { workingDays, slots, availabilityList, weeklySchedule } = action.payload.data || action.payload || {};

                // 1. Always update workingDays and slots
                state.workingDays = workingDays || [];
                state.slots = slots || [];
                state.isScheduleLoaded = true;

                // 2. Update weekly schedule if present
                const scheduleData = weeklySchedule || availabilityList;
                if (scheduleData) {
                    state.weeklySchedule = scheduleData;
                }
            })
            .addCase(fetchDoctorSchedule.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Save Weekly Schedule
            .addCase(saveWeeklySchedule.pending, (state) => {
                state.isActionLoading = true;
            })
            .addCase(saveWeeklySchedule.fulfilled, (state) => {
                state.isActionLoading = false;
                state.isScheduleLoaded = false; // Reset to force re-fetch of updated schedule
            })
            .addCase(saveWeeklySchedule.rejected, (state, action) => {
                state.isActionLoading = false;
                state.error = action.payload;
            })
            // Legacy / Single operations support
            .addCase(updateAvailability.fulfilled, (state) => {
                state.isActionLoading = false;
                state.isScheduleLoaded = false;
            })
            .addCase(deleteAvailability.fulfilled, (state) => {
                state.isActionLoading = false;
                state.isScheduleLoaded = false;
            });
    },
});

export const { clearSlots, clearSchedule, clearAvailabilityError } = availabilitySlice.actions;
export default availabilitySlice.reducer;
