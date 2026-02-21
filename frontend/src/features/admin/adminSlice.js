import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    stats: null,
    isLoading: false,
    error: null,
};

const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        setAdminLoading: (state, action) => {
            state.isLoading = action.payload;
        },
    },
});

export const { setAdminLoading } = adminSlice.actions;
export default adminSlice.reducer;
