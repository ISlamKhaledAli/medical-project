export const ENDPOINTS = {
  /* ================= AUTH ================= */
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
    VERIFY_EMAIL: "/auth/verify-email",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    ME: "/auth/me",
  },

  /* ================= DOCTOR ================= */
  DOCTOR: {
    LIST: "/doctors",
    DETAILS: (id) => `/doctors/${id}`,
    UPDATE: (id) => `/doctors/${id}`,
    DELETE: (id) => `/doctors/${id}`,
  },

  /* ================= SPECIALTY ================= */
  SPECIALTY: {
    LIST: "/specialties",
    CREATE: "/specialties",
    DELETE: (id) => `/specialties/${id}`,
    UPDATE: (id) => `/specialties/${id}`,
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
    CREATE: "/appointments",
    DETAILS: (id) => `/appointments/${id}`,
    CANCEL: (id) => `/appointments/${id}/cancel`,
    RESCHEDULE: (id) => `/appointments/${id}/reschedule`,
  },

  /* ================= ADMIN ================= */
  ADMIN: {
    USERS: "/admin/users",
    APPROVE_USER: (id) => `/admin/users/${id}/approve`,
    BLOCK_USER: (id) => `/admin/users/${id}/block`,
    UNBLOCK_USER: (id) => `/admin/users/${id}/unblock`,
    DELETE_USER: (id) => `/admin/users/${id}`,
    STATS: "/admin/stats",
  },

  /* ================= NOTIFICATION ================= */
  NOTIFICATION: {
    LIST: "/notifications",
    MARK_AS_READ: (id) => `/notifications/${id}/read`,
    DELETE: (id) => `/notifications/${id}`,
  },
};