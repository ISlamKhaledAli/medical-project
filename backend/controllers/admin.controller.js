import {
    getAllUsers,
    getUserById,
    approveDoctor,
    blockUser,
    unblockUser,
    deleteUser,
    updateUserRole,
    rejectDoctor,
} from "../services/admin.service.js";
import wrapAsync from "../middleware/asyncHandler.js";

//GET /api/admin/users


export const getAllUsersHandler = wrapAsync(async (req, res) => {
    const result = await getAllUsers({
        queryParams: req.query,
    });

    res.json({
        success: true,
        ...result,
    });
});

//GET /api/admin/users/:id
export const getUserByIdHandler = wrapAsync(async (req, res) => {
    const result = await getUserById({
        userId: req.params.id,
    });

    res.json({
        success: true,
        data: result,
    });
});

//PATCH /api/admin/users/:id/approve

export const approveDoctorHandler = wrapAsync(async (req, res) => {
    const user = await approveDoctor({
        userId: req.params.id,
        currentUserId: req.user._id,
    });

    res.json({
        success: true,
        data: user,
    });
});

//PATCH /api/admin/users/:id/reject

export const rejectDoctorHandler = wrapAsync(async (req, res) => {
    const user = await rejectDoctor({
        userId: req.params.id,
        currentUserId: req.user._id,
    });

    res.json({
        success: true,
        data: user,
    });
});

//PATCH /api/admin/users/:id/block
export const blockUserHandler = wrapAsync(async (req, res) => {
    const user = await blockUser({
        userId: req.params.id,
        currentUserId: req.user._id,
    });

    res.json({
        success: true,
        data: user,
    });
});

//PATCH /api/admin/users/:id/unblock


export const unblockUserHandler = wrapAsync(async (req, res) => {
    const user = await unblockUser({
        userId: req.params.id,
    });

    res.json({
        success: true,
        data: user,
    });
});

//DELETE /api/admin/users/:id


export const deleteUserHandler = wrapAsync(async (req, res) => {
    const result = await deleteUser({
        userId: req.params.id,
        currentUserId: req.user._id,
    });

    res.json({
        success: true,
        ...result,
    });
});

//PATCH /api/admin/users/:id/role


export const updateUserRoleHandler = wrapAsync(async (req, res) => {
    const user = await updateUserRole({
        userId: req.params.id,
        newRole: req.body.role,
        currentUserId: req.user._id,
    });

    res.json({
        success: true,
        data: user,
    });
});
