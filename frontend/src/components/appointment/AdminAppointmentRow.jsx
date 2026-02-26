import React, { memo, useState } from "react";
import { 
    TableRow, 
    TableCell, 
    Box, 
    Avatar, 
    Typography, 
    IconButton, 
    Tooltip,
    Stack,
    alpha,
    useTheme,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button
} from "@mui/material";
import { 
    Eye, 
    CheckCircle2, 
    XCircle, 
    Trash2,
    Calendar,
    Clock,
    AlertTriangle,
    RefreshCw
} from "lucide-react";
import { format, parseISO } from "date-fns";
import StatusBadge from "./StatusBadge";

const AdminAppointmentRow = ({ 
    appointment, 
    onView, 
    onApprove, 
    onCancel, 
    onDelete, 
    isLoading 
}) => {
    const theme = useTheme();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const { status } = appointment;
    
    const canApprove = status?.toLowerCase() === "pending";
    const canCancel = ["pending", "approved", "confirmed"].includes(status?.toLowerCase());

    const handleDeleteClick = () => setDeleteDialogOpen(true);
    const handleConfirmDelete = () => {
        onDelete(appointment._id);
        setDeleteDialogOpen(false);
    };

    return (
        <TableRow hover sx={{ "&:last-child td": { border: 0 } }}>
            <TableCell sx={{ py: 2.5, pl: 0 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar 
                        sx={{ 
                            width: 44, 
                            height: 44, 
                            borderRadius: 2.5,
                            bgcolor: "action.hover",
                            color: "primary.main",
                            fontWeight: 800,
                            border: "1px solid",
                            borderColor: "divider"
                        }}
                    >
                        {appointment.patient?.fullName?.[0] || "?"}
                    </Avatar>
                    <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                            {appointment.patient?.fullName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                            {appointment.patient?.email}
                        </Typography>
                    </Box>
                </Stack>
            </TableCell>
            <TableCell>
                <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        Dr. {appointment.doctor?.user?.fullName}
                    </Typography>
                    <Typography variant="caption" color="primary.main" sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.65rem' }}>
                        {appointment.doctor?.specialty?.name}
                    </Typography>
                </Box>
            </TableCell>
            <TableCell>
                <Stack spacing={0.5}>
                    <Typography variant="body2" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Calendar size={14} />
                        {appointment.appointmentDate ? format(parseISO(appointment.appointmentDate), "MMM dd, yyyy") : "N/A"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600 }}>
                        <Clock size={14} />
                        {appointment.startTime} - {appointment.endTime}
                    </Typography>
                </Stack>
            </TableCell>
            <TableCell>
                <StatusBadge status={status} />
            </TableCell>
            <TableCell align="right" sx={{ pr: 0 }}>
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Tooltip title="Deep Inspect">
                        <IconButton 
                            onClick={() => onView(appointment)}
                            sx={{ 
                                borderRadius: 2, 
                                bgcolor: "action.hover",
                                color: "text.primary",
                                "&:hover": { bgcolor: "action.selected" }
                            }}
                        >
                            <Eye size={18} />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title={canApprove ? "Verify & Approve" : "Restricted"}>
                        <span>
                            <IconButton 
                                onClick={() => onApprove(appointment._id)} 
                                color="success"
                                disabled={!canApprove || isLoading}
                                sx={{ 
                                    borderRadius: 2, 
                                    bgcolor: canApprove ? alpha(theme.palette.success.main, 0.05) : "transparent"
                                }}
                            >
                                {isLoading ? <RefreshCw size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                            </IconButton>
                        </span>
                    </Tooltip>

                    <Tooltip title={canCancel ? "Abbreviate Consultation" : "Restricted"}>
                        <span>
                            <IconButton 
                                onClick={() => onCancel(appointment._id)} 
                                color="warning"
                                disabled={!canCancel || isLoading}
                                sx={{ 
                                    borderRadius: 2, 
                                    bgcolor: canCancel ? alpha(theme.palette.warning.main, 0.08) : "transparent",
                                    "&:hover": { bgcolor: canCancel ? alpha(theme.palette.warning.main, 0.15) : "transparent" }
                                }}
                            >
                                <XCircle size={18} />
                            </IconButton>
                        </span>
                    </Tooltip>

                    <Tooltip title="Purge Record">
                        <IconButton 
                            onClick={handleDeleteClick} 
                            color="error"
                            disabled={isLoading}
                            sx={{ 
                                borderRadius: 2, 
                                bgcolor: alpha(theme.palette.error.main, 0.05)
                            }}
                        >
                            <Trash2 size={18} />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </TableCell>

            {/* Critical Delete Confirmation */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} PaperProps={{ sx: { borderRadius: 4 } }}>
                <DialogTitle component="div" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <AlertTriangle color={theme.palette.error.main} /> 
                    <Typography variant="h6" sx={{ fontWeight: 900 }}>Purge Clinical Record?</Typography>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                        You are about to permanently delete the consultation record between <strong>{appointment.patient?.fullName}</strong> and <strong>Dr. {appointment.doctor?.user?.fullName}</strong>.
                    </Typography>
                    <Typography variant="body2" color="error.main" sx={{ mt: 2, fontWeight: 700 }}>
                        This audit log cannot be recovered.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2.5 }}>
                    <Button onClick={() => setDeleteDialogOpen(false)} sx={{ fontWeight: 800, color: 'text.secondary' }}>Abort</Button>
                    <Button 
                        onClick={handleConfirmDelete} 
                        variant="contained" 
                        color="error" 
                        sx={{ fontWeight: 800, borderRadius: 2.5, px: 3 }}
                    >
                        Confirm Purge
                    </Button>
                </DialogActions>
            </Dialog>
        </TableRow>
    );
};

export default memo(AdminAppointmentRow);
