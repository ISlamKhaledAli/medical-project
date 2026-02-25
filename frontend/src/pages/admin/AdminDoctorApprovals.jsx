import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Container,
    Paper,
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Avatar,
    Chip,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Alert,
    Snackbar,
    Tooltip,
    Fade,
    Grow
} from "@mui/material";
import {
    CheckCircle as ApproveIcon,
    Cancel as RejectIcon,
    Refresh as RefreshIcon,
    Person as PersonIcon,
} from "@mui/icons-material";
import { fetchUsers, toggleUserStatus } from "../../features/admin/adminSlice";

const AdminDoctorApprovals = () => {
    const dispatch = useDispatch();
    const { users, isLoading, actionLoadingStates, error } = useSelector((state) => state.admin);

    // Filter for pending doctors only
    const pendingDoctors = users.filter(u => u.role?.toLowerCase() === "doctor" && u.status === "pending");

    const [confirmAction, setConfirmAction] = useState(null); // { id, name, action: 'approve' | 'reject' }
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    useEffect(() => {
        dispatch(fetchUsers({ role: "doctor", status: "pending" }));
    }, [dispatch]);

    const handleRefresh = () => {
        dispatch(fetchUsers({ role: "doctor", status: "pending" }));
    };

    const handleAction = async () => {
        if (!confirmAction) return;
        const { id, action, name } = confirmAction;
        const status = action === "approve" ? "approved" : "rejected";
        
        // Close dialog immediately for better UX
        setConfirmAction(null);

        const resultAction = await dispatch(toggleUserStatus({ id, status }));
        
        if (toggleUserStatus.fulfilled.match(resultAction)) {
            setSnackbar({
                open: true,
                message: `Doctor ${name} ${action === "approve" ? "approved" : "rejected"} successfully!`,
                severity: "success"
            });
            // Background sync for pagination/counts
            setTimeout(() => {
                handleRefresh();
            }, 800);
        } else {
            setSnackbar({
                open: true,
                message: resultAction.payload || "Action failed",
                severity: "error"
            });
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Fade in={true} timeout={800}>
                <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <Box>
                        <Typography variant="h3" fontWeight="900" color="primary.main" sx={{ mb: 1, letterSpacing: "-0.02em" }}>
                            Approvals
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" sx={{ fontWeight: 500 }}>
                            Review and authorize new medical professional registrations.
                        </Typography>
                    </Box>
                    <Button 
                        variant="contained" 
                        disableElevation
                        startIcon={<RefreshIcon />} 
                        onClick={handleRefresh}
                        disabled={isLoading}
                        sx={{ borderRadius: 2, fontWeight: 700, px: 3 }}
                    >
                        Sync List
                    </Button>
                </Box>
            </Fade>

            {error && (
                <Grow in={!!error}>
                    <Alert severity="error" sx={{ mb: 3, borderRadius: 2, fontWeight: 600 }}>{error}</Alert>
                </Grow>
            )}

            <TableContainer 
                component={Paper} 
                elevation={0} 
                sx={{ 
                    borderRadius: 4, 
                    border: "1px solid rgba(0,0,0,0.08)",
                    overflow: "hidden",
                    bgcolor: "background.paper"
                }}
            >
                {isLoading && users.length === 0 ? (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 15 }}>
                        <CircularProgress thickness={5} size={50} />
                    </Box>
                ) : (
                    <Table sx={{ minWidth: 700 }}>
                        <TableHead sx={{ bgcolor: "rgba(0,0,0,0.02)" }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 800, color: "text.secondary", py: 2.5 }}>DOCTOR PROFILE</TableCell>
                                <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>EMAIL ADDRESS</TableCell>
                                <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>REGISTRATION</TableCell>
                                <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>ACCOUNT STATUS</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 800, color: "text.secondary" }}>MANAGEMENT</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pendingDoctors.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 15 }}>
                                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", opacity: 0.6 }}>
                                            <Box 
                                                sx={{ 
                                                    width: 80, 
                                                    height: 80, 
                                                    borderRadius: "50%", 
                                                    bgcolor: "primary.light", 
                                                    display: "flex", 
                                                    justifyContent: "center", 
                                                    alignItems: "center",
                                                    mb: 2,
                                                    color: "primary.main"
                                                }}
                                            >
                                                <PersonIcon sx={{ fontSize: 40 }} />
                                            </Box>
                                            <Typography variant="h5" fontWeight="800" gutterBottom>Queue is empty</Typography>
                                            <Typography variant="body1" color="text.secondary">All doctor applications have been processed.</Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                pendingDoctors.map((doc, index) => {
                                    const isRowLoading = actionLoadingStates[doc._id];
                                    return (
                                        <Grow in={true} key={doc._id} timeout={300 + (index * 100)}>
                                            <TableRow hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                                <TableCell>
                                                    <Stack direction="row" spacing={2} alignItems="center">
                                                        <Avatar 
                                                            sx={{ 
                                                                bgcolor: "primary.main", 
                                                                fontWeight: 800,
                                                                width: 45,
                                                                height: 45,
                                                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                                                            }}
                                                        >
                                                            {doc.fullName?.[0] || doc.name?.[0] || "D"}
                                                        </Avatar>
                                                        <Typography variant="body1" fontWeight="700">
                                                            {doc.fullName || doc.name}
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell sx={{ fontWeight: 500, color: "text.secondary" }}>
                                                    {doc.email}
                                                </TableCell>
                                                <TableCell sx={{ color: "text.secondary" }}>
                                                    {new Date(doc.createdAt).toLocaleDateString("en-US", {
                                                        year: "numeric",
                                                        month: "short",
                                                        day: "numeric"
                                                    })}
                                                </TableCell>
                                                <TableCell>
                                                    <Chip 
                                                        label="PENDING REVIEW" 
                                                        color="warning" 
                                                        size="small" 
                                                        variant="soft"
                                                        sx={{ 
                                                            fontWeight: 800, 
                                                            textTransform: "uppercase", 
                                                            fontSize: "0.65rem",
                                                            letterSpacing: "0.05em",
                                                            borderRadius: 1
                                                        }} 
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Stack direction="row" spacing={1.5} justifyContent="flex-end">
                                                        <Tooltip title="Verify and Approve">
                                                            <span>
                                                                <Button
                                                                    variant="contained"
                                                                    color="success"
                                                                    disableElevation
                                                                    size="small"
                                                                    startIcon={isRowLoading ? <CircularProgress size={16} color="inherit" /> : <ApproveIcon />}
                                                                    onClick={() => setConfirmAction({ id: doc._id, name: doc.fullName || doc.name, action: "approve" })}
                                                                    disabled={isRowLoading}
                                                                    sx={{ fontWeight: 800, borderRadius: 2, height: 36 }}
                                                                >
                                                                    Approve
                                                                </Button>
                                                            </span>
                                                        </Tooltip>
                                                        <Tooltip title="Reject Application">
                                                            <span>
                                                                <Button
                                                                    variant="outlined"
                                                                    color="error"
                                                                    size="small"
                                                                    startIcon={isRowLoading ? <CircularProgress size={16} color="inherit" /> : <RejectIcon />}
                                                                    onClick={() => setConfirmAction({ id: doc._id, name: doc.fullName || doc.name, action: "reject" })}
                                                                    disabled={isRowLoading}
                                                                    sx={{ fontWeight: 800, borderRadius: 2, height: 36, borderWidth: 2, "&:hover": { borderWidth: 2 } }}
                                                                >
                                                                    Reject
                                                                </Button>
                                                            </span>
                                                        </Tooltip>
                                                    </Stack>
                                                </TableCell>
                                            </TableRow>
                                        </Grow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>

            {/* Confirmation Dialog */}
            <Dialog 
                open={!!confirmAction} 
                onClose={() => setConfirmAction(null)}
                PaperProps={{
                    sx: { borderRadius: 3, p: 1 }
                }}
            >
                <DialogTitle sx={{ fontWeight: 900, fontSize: "1.5rem" }}>
                    {confirmAction?.action === "approve" ? "Confirm Approval" : "Confirm Rejection"}
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ color: "text.secondary", mb: 2 }}>
                        Are you sure you want to <strong>{confirmAction?.action}</strong> doctor <strong>{confirmAction?.name}</strong>?
                        {confirmAction?.action === "reject" && " This will move them to the rejected list and permanently block dashboard access."}
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2, gap: 1 }}>
                    <Button onClick={() => setConfirmAction(null)} variant="text" color="inherit" sx={{ fontWeight: 700 }}>
                        Go Back
                    </Button>
                    <Button 
                        onClick={handleAction} 
                        variant="contained" 
                        color={confirmAction?.action === "approve" ? "success" : "error"}
                        sx={{ fontWeight: 800, borderRadius: 2, px: 3 }}
                    >
                        Yes, {confirmAction?.action === "approve" ? "Approve" : "Reject"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Notifications */}
            <Snackbar 
                open={snackbar.open} 
                autoHideDuration={5000} 
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert 
                    severity={snackbar.severity} 
                    variant="filled" 
                    sx={{ width: "100%", fontWeight: 800, borderRadius: 2, boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default AdminDoctorApprovals;
