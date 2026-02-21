import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getSpecialtiesAPI,
  createSpecialtyAPI,
  deleteSpecialtyAPI,
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
        state.specialties = action.payload;
      })
      .addCase(fetchSpecialties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* CREATE */
      .addCase(createSpecialty.fulfilled, (state, action) => {
        state.specialties.push(action.payload);
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