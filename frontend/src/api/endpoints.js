export const ENDPOINTS = {
  /* ================= AUTH ================= */
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    REFRESH: "/auth/refresh-token", // Fixed from /refresh
    LOGOUT: "/auth/logout",
    VERIFY_EMAIL: (token) => `/auth/verifyemail/${token}`, // Standardized path
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: (token) => `/auth/reset-password/${token}`, // Standardized path
    RESEND_VERIFICATION: "/auth/resend-verification",
    ME: "/auth/me",
  },

  /* ================= USER ================= */
  USER: {
    PROFILE: "/users/profile",
    CHANGE_PASSWORD: "/users/change-password",
  },

  /* ================= DOCTOR ================= */
  DOCTOR: {
    LIST: "/doctors",
    DETAILS: (id) => `/doctors/${id}`,
    UPDATE_PROFILE: "/doctors/profile", // Matches backend PATCH /profile
    CREATE_PROFILE: "/doctors/profile", // Matches backend POST /profile
    ME: "/doctors/profile/me",
  },

  /* ================= SPECIALTY ================= */
  SPECIALTY: {
    LIST: "/specialties",
    CREATE: "/specialties",
    UPDATE: (id) => `/specialties/${id}`,
    DELETE: (id) => `/specialties/${id}`,
  },

  /* ================= AVAILABILITY ================= */
  AVAILABILITY: {
    DOCTOR: (doctorId) => `/availability/${doctorId}`,
    SET: "/availability",
    UPDATE: (id) => `/availability/${id}`,
    DELETE: (id) => `/availability/${id}`,
  },

  /* ================= APPOINTMENT ================= */
  APPOINTMENT: {
    LIST: "/appointments",
    MY: "/appointments/my",
    CREATE: "/appointments",
    DETAILS: (id) => `/appointments/${id}`,
    CANCEL: (id) => `/appointments/${id}/cancel`,
    RESCHEDULE: (id) => `/appointments/${id}/reschedule`,
    UPDATE_STATUS: (id) => `/appointments/${id}/status`, // Centralized status update
    STATS: "/appointments/stats",
    DELETE: (id) => `/appointments/${id}`, // Reserved for future/admin use
  },

  /* ================= ADMIN ================= */
  ADMIN: {
    USERS: "/admin/users",
    APPROVE_USER: (id) => `/admin/users/${id}/approve`,
    REJECT_USER: (id) => `/admin/users/${id}/reject`,
    BLOCK_USER: (id) => `/admin/users/${id}/block`,
    UNBLOCK_USER: (id) => `/admin/users/${id}/unblock`,
    DELETE_USER: (id) => `/admin/users/${id}`,
    UPDATE_ROLE: (id) => `/admin/users/${id}/role`,
  },

  /* ================= NOTIFICATION ================= */
  NOTIFICATION: {
    LIST: "/notifications",
    MARK_AS_READ: (id) => `/notifications/${id}/read`,
    MARK_ALL_READ: "/notifications/read-all",
    DELETE: (id) => `/notifications/${id}`,
  },
};
