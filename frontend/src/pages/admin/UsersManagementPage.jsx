import { useEffect } from "react";
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
    IconButton,
    Button
} from "@mui/material";
import { 
    Block as BlockIcon, 
    CheckCircle as ApproveIcon 
} from "@mui/icons-material";
import { fetchUsers, toggleUserStatus } from "../../features/admin/adminSlice";

const UsersManagementPage = () => {
    const dispatch = useDispatch();
    const { users, isLoading } = useSelector((state) => state.admin);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const handleToggleStatus = (id, currentStatus) => {
        const newStatus = currentStatus === "active" ? "blocked" : "active";
        dispatch(toggleUserStatus({ id, status: newStatus }));
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
                            <TableCell sx={{ fontWeight: 800 }}>User</TableCell>
                            <TableCell sx={{ fontWeight: 800 }}>Email</TableCell>
                            <TableCell sx={{ fontWeight: 800 }}>Role</TableCell>
                            <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 800 }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id} hover>
                                <TableCell>
                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                        <Avatar sx={{ mr: 2 }}>{user.name[0]}</Avatar>
                                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{user.name}</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Chip 
                                        label={user.role} 
                                        size="small" 
                                        variant="outlined" 
                                        sx={{ textTransform: "capitalize", fontWeight: 700 }} 
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip 
                                        label={user.status || "active"} 
                                        size="small" 
                                        color={user.status === "blocked" ? "error" : "success"}
                                        sx={{ fontWeight: 700 }} 
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <Button
                                        size="small"
                                        startIcon={user.status === "blocked" ? <ApproveIcon /> : <BlockIcon />}
                                        color={user.status === "blocked" ? "success" : "error"}
                                        onClick={() => handleToggleStatus(user.id, user.status)}
                                        sx={{ fontWeight: 700 }}
                                    >
                                        {user.status === "blocked" ? "Unblock" : "Block"}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default UsersManagementPage;
