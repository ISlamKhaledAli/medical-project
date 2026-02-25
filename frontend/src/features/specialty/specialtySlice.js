import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getSpecialtiesAPI,
  createSpecialtyAPI,
  deleteSpecialtyAPI,
  updateSpecialtyAPI,
} from "./specialtyAPI";

/* FETCH */
export const fetchSpecialties = createAsyncThunk(
  "specialty/fetchSpecialties",
  async (_, { rejectWithValue }) => {
    try {
      return await getSpecialtiesAPI();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Failed to fetch specialties"
      );
    }
  }
);

/* CREATE */
export const createSpecialty = createAsyncThunk(
  "specialty/createSpecialty",
  async (body, { rejectWithValue }) => {
    try {
      return await createSpecialtyAPI(body);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Failed to create specialty"
      );
    }
  }
);

/* DELETE */
export const deleteSpecialty = createAsyncThunk(
  "specialty/deleteSpecialty",
  async (id, { rejectWithValue }) => {
    try {
      return await deleteSpecialtyAPI(id);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Failed to delete specialty"
      );
    }
  }
);

/* UPDATE */
export const updateSpecialty = createAsyncThunk(
  "specialty/updateSpecialty",
  async ({ id, body }, { rejectWithValue }) => {
    try {
      return await updateSpecialtyAPI(id, body);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Failed to update specialty"
      );
    }
  }
);

const specialtySlice = createSlice({
  name: "specialty",
  initialState: {
    specialties: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* FETCH */
      .addCase(fetchSpecialties.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSpecialties.fulfilled, (state, action) => {
        state.loading = false;
        state.specialties = action.payload.data || [];
      })
      .addCase(fetchSpecialties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* CREATE */
      .addCase(createSpecialty.pending, (state) => {
        state.loading = true;
      })
      .addCase(createSpecialty.fulfilled, (state, action) => {
        state.loading = false;
        state.specialties.push(action.payload.data || action.payload);
      })
      .addCase(createSpecialty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* UPDATE */
      .addCase(updateSpecialty.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSpecialty.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload.data || action.payload;
        const index = state.specialties.findIndex(
          (s) => s._id === updated._id
        );
        if (index !== -1) {
          state.specialties[index] = updated;
        }
      })
      .addCase(updateSpecialty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* DELETE */
      .addCase(deleteSpecialty.fulfilled, (state, action) => {
        state.specialties = state.specialties.filter(
          (s) => s._id !== action.meta.arg
        );
      });
  },
});

export default specialtySlice.reducer;