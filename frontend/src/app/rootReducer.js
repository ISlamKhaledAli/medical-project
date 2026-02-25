import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import uiReducer from "../features/ui/uiSlice";
import doctorReducer from "../features/doctor/doctorSlice";
import specialtyReducer from "../features/specialty/specialtySlice";
import availabilityReducer from "../features/availability/availabilitySlice";
import appointmentReducer from "../features/appointment/appointmentSlice";
import adminReducer from "../features/admin/adminSlice";
import notificationReducer from "../features/notification/notificationSlice";

// Combine all app reducers
const appReducer = combineReducers({
    auth: authReducer,
    ui: uiReducer,
    doctor: doctorReducer,
    specialty: specialtyReducer,
    availability: availabilityReducer,
    appointment: appointmentReducer,
    admin: adminReducer,
    notification: notificationReducer,
});

/**
 * Root Reducer with global state reset capability.
 * When a user logs out, we pass undefined to the child reducers to reset them to initialState.
 */
const rootReducer = (state, action) => {
    if (action.type === "auth/logout") {
        // We keep the state undefined to trigger initial state in all reducers
        // Except maybe some UI state if we wanted to persist it across logouts (rare)
        state = undefined;
    }
    return appReducer(state, action);
};

export default rootReducer;