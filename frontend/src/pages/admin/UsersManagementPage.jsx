import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
    Container, 
    Paper, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow,
    Typography,
    Box,
    Avatar,
    Chip,
    Button,
} from "@mui/material";
import { 
    Block as BlockIcon, 
    CheckCircle as ApproveIcon 
} from "@mui/icons-material";
import { fetchUsers, toggleUserStatus } from "../../features/admin/adminSlice";
import { debugAdmin } from "../../utils/debugTrace";
import { setGlobalSearchQuery } from "../../features/ui/uiSlice";

const UsersManagementPage = () => {
    const dispatch = useDispatch();
    const { users, isLoading } = useSelector((state) => state.admin);
    const { globalSearchQuery } = useSelector((state) => state.ui);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    // Filter users based on global search query
    const filteredUsers = useMemo(() => {
        if (!globalSearchQuery) return users;
        const query = globalSearchQuery.toLowerCase();
        return users.filter(user => 
            user.fullName?.toLowerCase().includes(query) ||
            user.name?.toLowerCase().includes(query) ||
            user.email?.toLowerCase().includes(query) ||
            user.role?.toLowerCase().includes(query)
        );
    }, [users, globalSearchQuery]);

    const handleToggleStatus = (id, isCurrentlyBlocked) => {
        const targetStatus = isCurrentlyBlocked ? "active" : "blocked";
        debugAdmin(`Toggling status for user ${id}. Current block state: ${isCurrentlyBlocked}. Target status: ${targetStatus}`);
        dispatch(toggleUserStatus({ id, status: targetStatus }));
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 5 }}>
                <Typography variant="h4" sx={{ fontWeight: 900, color: "#1a237e", mb: 1 }}>
                    User Management
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Manage system access and roles for all registered users.
                </Typography>
            </Box>

            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, border: "1px solid rgba(0,0,0,0.05)" }}>
                <Table>
                    <TableHead sx={{ bgcolor: "rgba(0,0,0,0.02)" }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 800 }}>User Info</TableCell>
                            <TableCell sx={{ fontWeight: 800 }}>Role</TableCell>
                            <TableCell sx={{ fontWeight: 800 }}>Account Status</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 800 }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredUsers.map((user) => {
                            const isBlocked = user.isBlocked;
                            const accountStatus = user.status || (user.role === "doctor" ? "pending" : "approved");
                            
                            return (
                                <TableRow key={user._id} hover>
                                    <TableCell>
                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                            <Avatar sx={{ mr: 2, bgcolor: user.role === "doctor" ? "primary.light" : "secondary.light" }}>
                                                {user?.fullName?.[0] || user?.name?.[0] || "U"}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                                    {user?.fullName || user?.name || "Unknown User"}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {user.email}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={user.role} 
                                            size="small" 
                                            variant="outlined" 
                                            sx={{ textTransform: "capitalize", fontWeight: 700 }} 
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                                            <Chip 
                                                label={accountStatus} 
                                                size="small" 
                                                color={
                                                    accountStatus === "approved" ? "success" : 
                                                    accountStatus === "pending" ? "warning" : "error"
                                                }
                                                sx={{ fontWeight: 700, textTransform: "capitalize", maxWidth: "fit-content" }} 
                                            />
                                            {isBlocked && (
                                                <Chip 
                                                    label="Blocked" 
                                                    size="small" 
                                                    color="error"
                                                    variant="outlined"
                                                    sx={{ fontWeight: 700, maxWidth: "fit-content" }} 
                                                />
                                            )}
                                        </Box>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            startIcon={isBlocked ? <ApproveIcon /> : <BlockIcon />}
                                            color={isBlocked ? "success" : "error"}
                                            onClick={() => handleToggleStatus(user._id, isBlocked)}
                                            sx={{ fontWeight: 700 }}
                                        >
                                            {isBlocked ? "Unblock" : "Block"}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default UsersManagementPage;
