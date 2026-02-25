import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import availabilityAPI from "./availabilityAPI";

export const fetchDoctorAvailability = createAsyncThunk(
    "availability/fetchSlots",
    async ({ doctorId, date }, { rejectWithValue }) => {
        try {
            const response = await availabilityAPI.fetchSlots(doctorId, date);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch availability");
        }
    }
);

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

const initialState = {
    slots: [], // For patient-side slot picking
    availabilityList: [], // For doctor-side schedule management
    isLoading: false,
    isActionLoading: false, // For CRUD operations
    error: null,
};

const availabilitySlice = createSlice({
    name: "availability",
    initialState,
    reducers: {
        clearSlots: (state) => {
            state.slots = [];
        },
        clearAvailabilityError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchDoctorAvailability.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchDoctorAvailability.fulfilled, (state, action) => {
                state.isLoading = false;
                // Backend returns { success: true, data: [...] } or just [...]
                const slotsArray = action.payload.data || (Array.isArray(action.payload) ? action.payload : []);
                state.slots = slotsArray;
                state.availabilityList = slotsArray;
            })
            .addCase(fetchDoctorAvailability.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Create
            .addCase(createAvailability.pending, (state) => {
                state.isActionLoading = true;
            })
            .addCase(createAvailability.fulfilled, (state, action) => {
                state.isActionLoading = false;
                state.availabilityList.push(action.payload.data || action.payload);
            })
            .addCase(createAvailability.rejected, (state, action) => {
                state.isActionLoading = false;
                state.error = action.payload;
            })
            // Update
            .addCase(updateAvailability.pending, (state) => {
                state.isActionLoading = true;
            })
            .addCase(updateAvailability.fulfilled, (state, action) => {
                state.isActionLoading = false;
                const updated = action.payload.data || action.payload;
                const index = state.availabilityList.findIndex(a => a._id === updated._id);
                if (index !== -1) {
                    state.availabilityList[index] = updated;
                }
            })
            .addCase(updateAvailability.rejected, (state, action) => {
                state.isActionLoading = false;
                state.error = action.payload;
            })
            // Delete
            .addCase(deleteAvailability.pending, (state) => {
                state.isActionLoading = true;
            })
            .addCase(deleteAvailability.fulfilled, (state, action) => {
                state.isActionLoading = false;
                state.availabilityList = state.availabilityList.filter(a => a._id !== action.payload);
            })
            .addCase(deleteAvailability.rejected, (state, action) => {
                state.isActionLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearSlots, clearAvailabilityError } = availabilitySlice.actions;
export default availabilitySlice.reducer;
