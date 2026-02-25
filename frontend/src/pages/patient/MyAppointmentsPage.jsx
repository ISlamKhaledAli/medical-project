import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
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
    Avatar,
    Tooltip
} from "@mui/material";
import { 
    Cancel as CancelIcon, 
    EventRepeat as RescheduleIcon,
    Visibility as ViewIcon 
} from "@mui/icons-material";
import { format } from "date-fns";

import { fetchMyAppointments, cancelAppointment } from "../../features/appointment/appointmentSlice";
import StatusBadge from "../../components/appointment/StatusBadge";
import AppointmentDetailsModal from "../../components/appointment/AppointmentDetailsModal";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";

const MyAppointmentsPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { appointments, isLoading, error, isActionLoading } = useSelector((state) => state.appointment);
    
    // Dialog/Modal States
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    useEffect(() => {
        dispatch(fetchMyAppointments());
    }, [dispatch]);

    const handleOpenCancelDialog = useCallback((appointment) => {
        setSelectedAppointment(appointment);
        setCancelDialogOpen(true);
    }, []);

    const handleOpenDetails = useCallback((appointment) => {
        setSelectedAppointment(appointment);
        setDetailsModalOpen(true);
    }, []);

    const handleCloseDialogs = useCallback(() => {
        setCancelDialogOpen(false);
        setDetailsModalOpen(false);
        setSelectedAppointment(null);
    }, []);

    const handleConfirmCancel = async () => {
        if (selectedAppointment) {
            const id = selectedAppointment._id || selectedAppointment.id;
            await dispatch(cancelAppointment(id));
            handleCloseDialogs();
        }
    };

    const handleReschedule = useCallback((appointment) => {
        // Navigate to booking page with doctor pre-selected
        const doctorId = appointment.doctor?._id || appointment.doctor?.id;
        
        if (!doctorId) {
            console.error('doctorId is undefined', appointment);
            return;
        }

        navigate(`/patient/book/${doctorId}`, { 
            state: { 
                rescheduleId: appointment._id || appointment.id,
                doctorName: appointment.doctor?.user?.fullName || appointment.doctor?.name,
                specialty: appointment.doctor?.specialty?.name || appointment.doctor?.specialty
            } 
        });
    }, [navigate]);

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
                                appointments.map((appointment) => {
                                    const isTerminal = ["completed", "cancelled", "rejected"].includes(appointment.status);
                                    
                                    return (
                                        <TableRow key={appointment._id || appointment.id} hover>
                                            <TableCell>
                                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                                    <Avatar 
                                                        src={appointment.doctor?.image} 
                                                        sx={{ width: 40, height: 40, mr: 2, border: "1px solid rgba(0,0,0,0.05)" }} 
                                                    />
                                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                                        {appointment.doctor?.user?.fullName || appointment.doctor?.name}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>{appointment.doctor?.specialty?.name || appointment.doctor?.specialty}</TableCell>
                                            <TableCell>
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                    {format(new Date(appointment.appointmentDate), "PPP")}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {appointment.startTime} - {appointment.endTime}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <StatusBadge status={appointment.status} />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                                                    {!isTerminal && (
                                                        <>
                                                            <Tooltip title="Cancel Appointment">
                                                                <IconButton 
                                                                    size="small" 
                                                                    color="error" 
                                                                    onClick={() => handleOpenCancelDialog(appointment)}
                                                                >
                                                                    <CancelIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Reschedule">
                                                                <IconButton 
                                                                    size="small" 
                                                                    color="primary" 
                                                                    onClick={() => handleReschedule(appointment)}
                                                                >
                                                                    <RescheduleIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </>
                                                    )}
                                                    <Tooltip title="View Details">
                                                        <IconButton 
                                                            size="small" 
                                                            onClick={() => handleOpenDetails(appointment)}
                                                        >
                                                            <ViewIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
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

            {/* Appointment Details Modal */}
            <AppointmentDetailsModal 
                open={detailsModalOpen}
                onClose={handleCloseDialogs}
                appointment={selectedAppointment}
            />

            {/* Cancel Confirmation Dialog */}
            <Dialog 
                open={cancelDialogOpen} 
                onClose={handleCloseDialogs}
                PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
            >
                <DialogTitle sx={{ fontWeight: 900 }}>Cancel Appointment?</DialogTitle>
                <DialogContent>
                    <Typography color="text.secondary">
                        Are you sure you want to cancel your appointment with Dr. {selectedAppointment?.doctor?.user?.fullName || selectedAppointment?.doctor?.name} on {selectedAppointment && format(new Date(selectedAppointment.appointmentDate), "PPP")}? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={handleCloseDialogs} sx={{ fontWeight: 700 }}>No, Keep It</Button>
                    <Button 
                        variant="contained" 
                        color="error" 
                        onClick={handleConfirmCancel}
                        disabled={isActionLoading}
                        sx={{ borderRadius: 2, fontWeight: 700 }}
                    >
                        {isActionLoading ? <CircularProgress size="20" color="inherit" /> : "Yes, Cancel"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default MyAppointmentsPage;
