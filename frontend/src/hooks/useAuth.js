import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    login as loginThunk,
    logoutUser as logoutThunk,
    register as registerThunk,
    clearError,
} from "../features/auth/authSlice";
import {
    selectUser,
    selectIsAuthenticated,
    selectUserRole,
    selectIsAdmin,
    selectIsDoctor,
    selectAuthLoading,
    selectAuthError,
    selectAuthSuccessMessage
} from "../features/auth/authSelectors";

/**
 * useAuth Hook
 * Centralizes authentication logic and state for all components.
 * Reduces boilerplate and ensures consistent state access.
 */
export const useAuth = () => {
    const dispatch = useDispatch();

    // Selectors
    const user = useSelector(selectUser);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const role = useSelector(selectUserRole);
    const isAdmin = useSelector(selectIsAdmin);
    const isDoctor = useSelector(selectIsDoctor);
    const loading = useSelector(selectAuthLoading);
    const error = useSelector(selectAuthError);
    const successMessage = useSelector(selectAuthSuccessMessage);

    // Actions
    const login = useCallback((credentials) => {
        return dispatch(loginThunk(credentials));
    }, [dispatch]);

    const register = useCallback((userData) => {
        return dispatch(registerThunk(userData));
    }, [dispatch]);

    const logout = useCallback(() => {
        return dispatch(logoutThunk());
    }, [dispatch]);

    const clearAuthError = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    return {
        // State
        user,
        isAuthenticated,
        role,
        isAdmin,
        isDoctor,
        ...loading,
        error,
        successMessage,

        // Methods
        login,
        register,
        logout,
        clearAuthError,
    };
};

export default useAuth;
