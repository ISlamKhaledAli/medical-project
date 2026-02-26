import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    globalLoading: false,
    mode: localStorage.getItem("themeMode") || "light",
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
        toggleTheme: (state) => {
            state.mode = state.mode === "light" ? "dark" : "light";
            localStorage.setItem("themeMode", state.mode);
        },
    },
});

export const { startGlobalLoading, stopGlobalLoading, toggleTheme } = uiSlice.actions;
export default uiSlice.reducer;
