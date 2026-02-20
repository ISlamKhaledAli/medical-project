import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import uiReducer from "../features/ui/uiSlice";
import doctorReducer from "../features/doctor/doctorSlice";
import appointmentReducer from "../features/appointment/appointmentSlice";
import adminReducer from "../features/admin/adminSlice";

// Root reducer combining all features
const rootReducer = combineReducers({
    auth: authReducer,
    ui: uiReducer,
    doctor: doctorReducer,
    appointment: appointmentReducer,
    admin: adminReducer,
    notification: (state = {}) => state,
});

export default rootReducer;