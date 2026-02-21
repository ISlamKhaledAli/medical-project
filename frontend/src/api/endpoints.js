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
    LIST: "/doctors", // GET (list + filtering + pagination)
    DETAILS: (id) => `/doctors/${id}`, // GET by id
    UPDATE: (id) => `/doctors/${id}`, // PATCH
    DELETE: (id) => `/doctors/${id}`, // DELETE
  },

  /* ================= SPECIALTY ================= */
  SPECIALTY: {
    LIST: "/specialties", // GET
    CREATE: "/specialties", // POST
    UPDATE: (id) => `/specialties/${id}`, // PATCH
    DELETE: (id) => `/specialties/${id}`, // DELETE
  },

  /* ================= AVAILABILITY ================= */
  AVAILABILITY: {
    DOCTOR: (doctorId) => `/availability/${doctorId}`, // GET doctor availability
    SET: "/availability", // POST
    UPDATE: (id) => `/availability/${id}`, // PATCH
    DELETE: (id) => `/availability/${id}`, // DELETE
  },

  /* ================= APPOINTMENT ================= */
  APPOINTMENT: {
    LIST: "/appointments", // GET all my appointments
    CREATE: "/appointments", // POST new appointment
    DETAILS: (id) => `/appointments/${id}`, // GET by id
    CANCEL: (id) => `/appointments/${id}/cancel`, // PATCH cancel
    RESCHEDULE: (id) => `/appointments/${id}/reschedule`, // PATCH reschedule
  },

  /* ================= ADMIN ================= */
  ADMIN: {
    USERS: "/admin/users", // GET
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