import { Router } from "express";
import {
    getAllUsersHandler,
    getUserByIdHandler,
    approveDoctorHandler,
    rejectDoctorHandler,
    blockUserHandler,
    unblockUserHandler,
    deleteUserHandler,
    updateUserRoleHandler,
} from "../controllers/admin.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";
import validateObjectId from "../middleware/validateObjectId.js";

const router = Router();

// All admin routes require authentication + admin role
router.use(protect, authorize("admin"));

// GET /api/admin/users — list all users (paginated + filters)
router.get("/users", getAllUsersHandler);

// GET /api/admin/users/:id — get single user by ID
router.get("/users/:id", validateObjectId("id"), getUserByIdHandler);

// PATCH /api/admin/users/:id/approve — approve a doctor
router.patch(
    "/users/:id/approve",
    validateObjectId("id"),
    approveDoctorHandler,
);

// PATCH /api/admin/users/:id/reject — reject a doctor
router.patch(
    "/users/:id/reject",
    validateObjectId("id"),
    rejectDoctorHandler,
);

// PATCH /api/admin/users/:id/block — block a user
router.patch("/users/:id/block", validateObjectId("id"), blockUserHandler);

// PATCH /api/admin/users/:id/unblock — unblock a user
router.patch("/users/:id/unblock", validateObjectId("id"), unblockUserHandler);

// PATCH /api/admin/users/:id/role — change user role
router.patch("/users/:id/role", validateObjectId("id"), updateUserRoleHandler);

// DELETE /api/admin/users/:id — delete a user
router.delete("/users/:id", validateObjectId("id"), deleteUserHandler);

export default router;
