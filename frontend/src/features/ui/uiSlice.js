import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  globalLoading: false,
  globalSearchQuery: "",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    startGlobalLoading: (state) => {
      state.globalLoading = true;
    },
    stopGlobalLoading: (state) => {
      state.globalLoading = false;
    },
    setGlobalSearchQuery: (state, action) => {
      state.globalSearchQuery = action.payload;
    },
    clearGlobalSearchQuery: (state) => {
      state.globalSearchQuery = "";
    },
  },
});

export const {
  startGlobalLoading,
  stopGlobalLoading,
  setGlobalSearchQuery,
  clearGlobalSearchQuery,
} = uiSlice.actions;
export default uiSlice.reducer;
