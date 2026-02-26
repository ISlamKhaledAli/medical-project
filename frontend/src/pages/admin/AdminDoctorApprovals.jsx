import { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
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
    Alert,
    Snackbar,
    Tooltip,
    alpha,
    useTheme,
    IconButton
} from "@mui/material";
import {
    UserCheck,
    UserX,
    RefreshCw,
    User,
    Mail,
    Calendar,
    ShieldCheck,
    AlertTriangle,
    Search
} from "lucide-react";
import { fetchUsers, toggleUserStatus, clearAdminError } from "../../features/admin/adminSlice";
import PageHeader from "../../components/ui/PageHeader";
import SectionCard from "../../components/ui/SectionCard";
import EmptyState from "../../components/ui/EmptyState";
import TableSkeleton from "../../components/skeletons/TableSkeleton";

const AdminDoctorApprovals = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const { users, isLoading, actionLoadingStates, error } = useSelector((state) => state.admin);

    const pendingDoctors = useMemo(() => 
        (users || []).filter(u => u.role?.toLowerCase() === "doctor" && u.status === "pending"),
    [users]);

    const [confirmAction, setConfirmAction] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    const handleRefresh = useCallback(() => {
        dispatch(fetchUsers({ role: "doctor", status: "pending" }));
    }, [dispatch]);

    useEffect(() => {
        handleRefresh();
        return () => {
            dispatch(clearAdminError());
        };
    }, [handleRefresh, dispatch]);

    const handleAction = async () => {
        if (!confirmAction) return;
        const { id, action, name } = confirmAction;
        const status = action === "approve" ? "approved" : "rejected";
        
        setConfirmAction(null);

        try {
            await dispatch(toggleUserStatus({ id, status })).unwrap();
            setSnackbar({
                open: true,
                message: `Doctor ${name} ${action === "approve" ? "approved" : "rejected"} successfully!`,
                severity: "success"
            });
        } catch (err) {
            setSnackbar({
                open: true,
                message: err || "Verification step failed",
                severity: "error"
            });
        }
    };

    return (
        <Box>
            <PageHeader 
                title="Credential Verification"
                subtitle="High-trust vetting process for medical professionals. Review certifications and identity before authorizing access."
                breadcrumbs={[
                    { label: "Admin", path: "/admin" },
                    { label: "Approvals", active: true }
                ]}
                action={{
                    label: "Sync Applications",
                    icon: RefreshCw,
                    onClick: handleRefresh,
                    disabled: isLoading
                }}
            />

            {error && (
                <Alert 
                    severity="error" 
                    variant="soft"
                    sx={{ mb: 3, borderRadius: 3, fontWeight: 700, border: "1px solid", borderColor: alpha(theme.palette.error.main, 0.2) }}
                >
                    {error}
                </Alert>
            )}

            {isLoading && users.length === 0 ? (
                <TableSkeleton rows={5} cols={5} />
            ) : (
                <SectionCard 
                    title="Pending Applications" 
                    subtitle={`${pendingDoctors.length} requests requiring immediate attention`}
                    sx={{ mt: 2 }}
                >
                    <TableContainer sx={{ mt: 1 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 800, color: "text.secondary", pl: 0 }}>Clinical Profile</TableCell>
                                    <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>Contact Information</TableCell>
                                    <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>Submission Date</TableCell>
                                    <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>Integrity Status</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 800, color: "text.secondary", pr: 0 }}>Review Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {pendingDoctors.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} sx={{ border: 0 }}>
                                            <EmptyState 
                                                title="Registry is Clean"
                                                message="There are no pending doctor applications at this moment. You're all caught up!"
                                                icon={ShieldCheck}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    pendingDoctors.map((doc) => {
                                        const isRowLoading = !!actionLoadingStates[doc._id];
                                        return (
                                            <TableRow key={doc._id} hover sx={{ '&:last-child td': { border: 0 } }}>
                                                <TableCell sx={{ py: 2.5, pl: 0 }}>
                                                    <Stack direction="row" spacing={2} alignItems="center">
                                                        <Avatar 
                                                            sx={{ 
                                                                width: 48, 
                                                                height: 48, 
                                                                borderRadius: 2.5,
                                                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                                color: "primary.main",
                                                                fontWeight: 800
                                                            }}
                                                        >
                                                            {doc.fullName?.[0] || doc.name?.[0] || "D"}
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                                                                {doc.fullName || doc.name}
                                                            </Typography>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                                                                <User size={12} />
                                                                <Typography variant="caption" sx={{ fontWeight: 600 }}>ID: {doc._id?.slice(-8).toUpperCase()}</Typography>
                                                            </Box>
                                                        </Box>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell>
                                                    <Stack spacing={0.5}>
                                                        <Typography variant="body2" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <Mail size={14} />
                                                            {doc.email}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Verified Source</Typography>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell>
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <Calendar size={14} color={theme.palette.text.secondary} />
                                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                            {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : "N/A"}
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip 
                                                        label="AWAITING AUDIT" 
                                                        size="small" 
                                                        sx={{ 
                                                            fontWeight: 800, 
                                                            bgcolor: alpha(theme.palette.warning.main, 0.1),
                                                            color: "warning.dark",
                                                            fontSize: '0.65rem',
                                                            letterSpacing: 0.5,
                                                            borderRadius: 1.5
                                                        }} 
                                                    />
                                                </TableCell>
                                                <TableCell align="right" sx={{ pr: 0 }}>
                                                    <Stack direction="row" spacing={1.5} justifyContent="flex-end">
                                                        <Button
                                                            variant="soft"
                                                            color="success"
                                                            size="small"
                                                            startIcon={isRowLoading ? <RefreshCw className="animate-spin" size={16} /> : <UserCheck size={16} />}
                                                            onClick={() => setConfirmAction({ id: doc._id, name: doc.fullName || doc.name, action: "approve" })}
                                                            disabled={isRowLoading}
                                                            sx={{ 
                                                                fontWeight: 800, 
                                                                borderRadius: 2.5, 
                                                                height: 38,
                                                                bgcolor: alpha(theme.palette.success.main, 0.1),
                                                                color: 'success.dark',
                                                                "&:hover": { bgcolor: alpha(theme.palette.success.main, 0.2) }
                                                            }}
                                                        >
                                                            Verify
                                                        </Button>
                                                        <IconButton
                                                            color="error"
                                                            size="small"
                                                            onClick={() => setConfirmAction({ id: doc._id, name: doc.fullName || doc.name, action: "reject" })}
                                                            disabled={isRowLoading}
                                                            sx={{ 
                                                                borderRadius: 2.5, 
                                                                bgcolor: alpha(theme.palette.error.main, 0.05),
                                                                "&:hover": { bgcolor: "error.main", color: "white" } 
                                                            }}
                                                        >
                                                            <UserX size={18} />
                                                        </IconButton>
                                                    </Stack>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </SectionCard>
            )}

            {/* Verification Confirmation Dialog */}
            <Dialog 
                open={!!confirmAction} 
                onClose={() => setConfirmAction(null)}
                PaperProps={{ sx: { borderRadius: 4, width: '100%', maxWidth: 450 } }}
            >
                <DialogTitle sx={{ p: 3, pb: 0 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{ 
                            p: 1.5, 
                            borderRadius: 2.5, 
                            bgcolor: alpha(confirmAction?.action === "approve" ? theme.palette.success.main : theme.palette.error.main, 0.1), 
                            color: confirmAction?.action === "approve" ? 'success.main' : 'error.main', 
                            display: 'flex' 
                        }}>
                            {confirmAction?.action === "approve" ? <UserCheck size={28} /> : <AlertTriangle size={28} />}
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 900 }}>
                            {confirmAction?.action === "approve" ? "Verify Practitioner?" : "Reject Registry?"}
                        </Typography>
                    </Stack>
                </DialogTitle>
                <DialogContent sx={{ p: 3 }}>
                    <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500, lineHeight: 1.6 }}>
                        You are about to <strong>{confirmAction?.action}</strong> doc <strong>{confirmAction?.name}</strong>. 
                        {confirmAction?.action === "approve" 
                            ? " This will grant them full clinical privileges and list them in the doctor search." 
                            : " This will permanently block their access and delete their application data."}
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 0 }}>
                    <Button 
                        onClick={() => setConfirmAction(null)} 
                        sx={{ fontWeight: 800, textTransform: 'none', color: 'text.secondary' }}
                    >
                        Review Profile
                    </Button>
                    <Button 
                        variant="contained" 
                        color={confirmAction?.action === "approve" ? "success" : "error"}
                        onClick={handleAction}
                        sx={{ 
                            borderRadius: 2.5, 
                            fontWeight: 900, 
                            textTransform: 'none',
                            px: 4,
                            boxShadow: `0 8px 16px ${alpha(confirmAction?.action === "approve" ? theme.palette.success.main : theme.palette.error.main, 0.2)}`
                        }}
                    >
                        Confirm {confirmAction?.action}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar 
                open={snackbar.open} 
                autoHideDuration={5000} 
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert 
                    severity={snackbar.severity} 
                    variant="filled" 
                    icon={<ShieldCheck size={20} />}
                    sx={{ width: "100%", fontWeight: 800, borderRadius: 2.5, boxShadow: "0 12px 32px rgba(0,0,0,0.1)" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AdminDoctorApprovals;
