import { createSelector } from "@reduxjs/toolkit";

/**
 * Common memoized selectors for Auth state to prevent unnecessary re-renders
 * and provide a clean interface for components.
 */

const selectAuthState = (state) => state.auth;

export const selectUser = createSelector(
    [selectAuthState],
    (auth) => auth.user
);

export const selectAccessToken = createSelector(
    [selectAuthState],
    (auth) => auth.accessToken
);

export const selectIsAuthenticated = createSelector(
    [selectUser, selectAccessToken],
    (user, token) => !!user && !!token
);

export const selectUserRole = createSelector(
    [selectUser],
    (user) => user?.role?.toLowerCase() || null
);

export const selectIsAdmin = createSelector(
    [selectUserRole],
    (role) => role === "admin"
);

export const selectIsDoctor = createSelector(
    [selectUserRole],
    (role) => role === "doctor"
);

export const selectAuthLoading = createSelector(
    [selectAuthState],
    (auth) => ({
        isLoading: auth.isLoading,
        isLoginLoading: auth.isLoginLoading,
        isRegisterLoading: auth.isRegisterLoading,
        isAuthChecking: auth.isAuthChecking
    })
);

export const selectAuthError = createSelector(
    [selectAuthState],
    (auth) => auth.error
);

export const selectAuthSuccessMessage = createSelector(
    [selectAuthState],
    (auth) => auth.successMessage
);
