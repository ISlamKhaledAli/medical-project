import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
    Container, 
    Typography, 
    Box, 
    Grid, 
    Paper, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow,
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Avatar
} from "@mui/material";
import { 
    Cancel as CancelIcon, 
    EventRepeat as RescheduleIcon,
    Visibility as ViewIcon 
} from "@mui/icons-material";
import { format } from "date-fns";

import { fetchMyAppointments, cancelAppointment } from "../../features/appointment/appointmentSlice";
import StatusBadge from "../../components/appointment/StatusBadge";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";

const MyAppointmentsPage = () => {
    const dispatch = useDispatch();
    const { appointments, isLoading, error, isActionLoading } = useSelector((state) => state.appointment);
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    useEffect(() => {
        dispatch(fetchMyAppointments());
    }, [dispatch]);

    const handleOpenCancelDialog = (appointment) => {
        setSelectedAppointment(appointment);
        setCancelDialogOpen(true);
    };

    const handleCloseCancelDialog = () => {
        setCancelDialogOpen(false);
        setSelectedAppointment(null);
    };

    const handleConfirmCancel = async () => {
        if (selectedAppointment) {
            await dispatch(cancelAppointment(selectedAppointment.id));
            handleCloseCancelDialog();
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 5 }}>
                <Typography variant="h4" sx={{ fontWeight: 900, color: "#1a237e", mb: 1 }}>
                    My Appointments
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Keep track of your upcoming and past medical consultations.
                </Typography>
            </Box>

            {error && <ErrorState message={error} onRetry={() => dispatch(fetchMyAppointments())} />}

            {!error && (
                <TableContainer 
                    component={Paper} 
                    elevation={0} 
                    sx={{ 
                        borderRadius: 4, 
                        border: "1px solid rgba(0,0,0,0.05)",
                        overflow: "hidden"
                    }}
                >
                    <Table>
                        <TableHead sx={{ bgcolor: "rgba(0,0,0,0.02)" }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 800 }}>Doctor</TableCell>
                                <TableCell sx={{ fontWeight: 800 }}>Specialty</TableCell>
                                <TableCell sx={{ fontWeight: 800 }}>Date & Time</TableCell>
                                <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 800 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {isLoading ? (
                                [...Array(5)].map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell colSpan={5} sx={{ py: 3, textAlign: "center" }}>
                                            <CircularProgress size={20} sx={{ mr: 2 }} />
                                            Loading...
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : appointments.length > 0 ? (
                                appointments.map((appointment) => (
                                    <TableRow key={appointment.id} hover>
                                        <TableCell>
                                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                                <Avatar 
                                                    src={appointment.doctor?.image} 
                                                    sx={{ width: 40, height: 40, mr: 2, border: "1px solid rgba(0,0,0,0.05)" }} 
                                                />
                                                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                                    Dr. {appointment.doctor?.name}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>{appointment.doctor?.specialty}</TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                {format(new Date(appointment.date), "PPP")}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {appointment.timeSlot}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <StatusBadge status={appointment.status} />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                                                {appointment.status === "pending" || appointment.status === "confirmed" ? (
                                                    <>
                                                        <IconButton 
                                                            size="small" 
                                                            color="error" 
                                                            title="Cancel Appointment"
                                                            onClick={() => handleOpenCancelDialog(appointment)}
                                                        >
                                                            <CancelIcon fontSize="small" />
                                                        </IconButton>
                                                        <IconButton 
                                                            size="small" 
                                                            color="primary" 
                                                            title="Reschedule"
                                                            onClick={() => {/* TODO: Reschedule logic */}}
                                                        >
                                                            <RescheduleIcon fontSize="small" />
                                                        </IconButton>
                                                    </>
                                                ) : null}
                                                <IconButton size="small" title="View Details">
                                                    <ViewIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5}>
                                        <EmptyState 
                                            message="No appointments scheduled" 
                                            subMessage="You haven't booked any consultations yet. Find a specialist to get started."
                                        />
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Cancel Confirmation Dialog */}
            <Dialog 
                open={cancelDialogOpen} 
                onClose={handleCloseCancelDialog}
                PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
            >
                <DialogTitle sx={{ fontWeight: 900 }}>Cancel Appointment?</DialogTitle>
                <DialogContent>
                    <Typography color="text.secondary">
                        Are you sure you want to cancel your appointment with Dr. {selectedAppointment?.doctor?.name} on {selectedAppointment && format(new Date(selectedAppointment.date), "PPP")}? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={handleCloseCancelDialog} sx={{ fontWeight: 700 }}>No, Keep It</Button>
                    <Button 
                        variant="contained" 
                        color="error" 
                        onClick={handleConfirmCancel}
                        disabled={isActionLoading}
                        sx={{ borderRadius: 2, fontWeight: 700 }}
                    >
                        {isActionLoading ? <CircularProgress size={20} color="inherit" /> : "Yes, Cancel"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default MyAppointmentsPage;
