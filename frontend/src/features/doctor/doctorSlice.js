import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDoctorsAPI, getDoctorByIdAPI } from "./doctorAPI";

export const fetchDoctors = createAsyncThunk(
  "doctor/fetchDoctors",
  async (params) => await getDoctorsAPI(params)
);

export const fetchDoctorById = createAsyncThunk(
  "doctor/fetchDoctorById",
  async (id) => await getDoctorByIdAPI(id)
);

const doctorSlice = createSlice({
  name: "doctor",
  initialState: {
    doctors: [],
    doctor: null,
    loading: false,
    pages: 1,
    filters: {
      name: "",
      specialty: "",
      page: 1,
      limit: 6,
    },
  },
  reducers: {
    setNameFilter: (state, action) => {
      state.filters.name = action.payload;
      state.filters.page = 1;
    },
    setSpecialtyFilter: (state, action) => {
      state.filters.specialty = action.payload;
      state.filters.page = 1;
    },
    setPage: (state, action) => {
      state.filters.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctors.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = action.payload.doctors;
        state.pages = action.payload.pages;
      })
      .addCase(fetchDoctorById.fulfilled, (state, action) => {
        state.doctor = action.payload.data;
      });
  },
});

export const { setNameFilter, setSpecialtyFilter, setPage } =
  doctorSlice.actions;

export default doctorSlice.reducer;