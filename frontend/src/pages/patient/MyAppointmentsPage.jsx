import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
    Typography, 
    Box, 
    Grid, 
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
    Avatar,
    Tooltip,
    Stack,
    alpha,
    useTheme
} from "@mui/material";
import { 
    XCircle, 
    RefreshCw,
    Eye,
    Calendar,
    Clock,
    FileText,
    AlertTriangle
} from "lucide-react";
import { format, parseISO } from "date-fns";

import { fetchMyAppointments, cancelAppointment } from "../../features/appointment/appointmentSlice";
import StatusBadge from "../../components/appointment/StatusBadge";
import AppointmentDetailsModal from "../../components/appointment/AppointmentDetailsModal";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import PageHeader from "../../components/ui/PageHeader";
import SectionCard from "../../components/ui/SectionCard";
import TableSkeleton from "../../components/skeletons/TableSkeleton";

const MyAppointmentsPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme();
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
        const doctorId = appointment.doctor?._id || appointment.doctor?.id;
        if (!doctorId) return;

        navigate(`/patient/book/${doctorId}`, { 
            state: { 
                rescheduleId: appointment._id || appointment.id,
                doctorName: appointment.doctor?.user?.fullName || appointment.doctor?.name,
                specialty: appointment.doctor?.specialty?.name || appointment.doctor?.specialty
            } 
        });
    }, [navigate]);

    return (
        <Box>
            <PageHeader 
                title="My Appointments"
                subtitle="Keep track of your medical history, manage upcoming visits, and review doctor notes."
                breadcrumbs={[
                    { label: "Dashboard", path: "/patient" },
                    { label: "Appointments", active: true }
                ]}
            />

            {error && <ErrorState message={error} onRetry={() => dispatch(fetchMyAppointments())} />}

            {!error && (
                <SectionCard 
                    title="All Consultations" 
                    subtitle={`${appointments?.length || 0} relative records found`}
                    sx={{ mt: 2 }}
                >
                {isLoading ? (
                    <TableSkeleton rows={6} cols={5} />
                ) : appointments?.length > 0 ? (
                    <TableContainer sx={{ mt: 1 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 800, color: "text.secondary", pl: 0 }}>Doctor</TableCell>
                                    <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>Schedule</TableCell>
                                    <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>Status</TableCell>
                                    <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>Medical Notes</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 800, color: "text.secondary", pr: 0 }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {appointments.map((appointment) => {
                                    const isTerminal = ["completed", "cancelled", "rejected"].includes(appointment.status);
                                    
                                    return (
                                        <TableRow key={appointment._id || appointment.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                                            <TableCell sx={{ py: 2.5, pl: 0 }}>
                                                <Stack direction="row" spacing={2} alignItems="center">
                                                    <Avatar 
                                                        src={appointment.doctor?.image} 
                                                        sx={{ 
                                                            width: 48, 
                                                            height: 48, 
                                                            borderRadius: 2.5,
                                                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                            color: "primary.main",
                                                            fontWeight: 900
                                                        }} 
                                                    >
                                                        {appointment.doctor?.user?.fullName?.[0] || appointment.doctor?.name?.[0]}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                                                            Dr. {appointment.doctor?.user?.fullName || appointment.doctor?.name}
                                                        </Typography>
                                                        <Typography variant="caption" color="primary.main" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                                            {appointment.doctor?.specialty?.name || appointment.doctor?.specialty}
                                                        </Typography>
                                                    </Box>
                                                </Stack>
                                            </TableCell>
                                            <TableCell>
                                                <Stack spacing={0.5}>
                                                    <Typography variant="body2" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Calendar size={14} />
                                                        {format(parseISO(appointment.appointmentDate), "MMM dd, yyyy")}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600 }}>
                                                        <Clock size={14} />
                                                        {appointment.startTime} - {appointment.endTime}
                                                    </Typography>
                                                </Stack>
                                            </TableCell>
                                            <TableCell>
                                                <StatusBadge status={appointment.status} />
                                            </TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <FileText size={16} color={appointment.doctorNotes ? theme.palette.text.primary : theme.palette.text.disabled} />
                                                    <Typography variant="body2" sx={{ 
                                                        maxWidth: 200, 
                                                        overflow: "hidden", 
                                                        textOverflow: "ellipsis", 
                                                        whiteSpace: "nowrap",
                                                        color: appointment.doctorNotes ? "text.primary" : "text.disabled",
                                                        fontWeight: appointment.doctorNotes ? 600 : 400,
                                                        fontStyle: appointment.doctorNotes ? "normal" : "italic"
                                                    }}>
                                                        {appointment.doctorNotes || "Waiting for visit..."}
                                                    </Typography>
                                                </Stack>
                                            </TableCell>
                                            <TableCell align="right" sx={{ pr: 0 }}>
                                                <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                    {!isTerminal && (
                                                        <>
                                                            <Tooltip title="Cancel">
                                                                  <IconButton 
                                                                    onClick={() => handleOpenCancelDialog(appointment)}
                                                                    sx={{ 
                                                                        borderRadius: 2, 
                                                                        bgcolor: alpha(theme.palette.error.main, 0.05),
                                                                        color: "error.main",
                                                                        "&:hover": { bgcolor: "error.main", color: "white" }
                                                                    }}
                                                                >
                                                                    <XCircle size={18} />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Reschedule">
                                                                <IconButton 
                                                                    onClick={() => handleReschedule(appointment)}
                                                                    sx={{ 
                                                                        borderRadius: 2, 
                                                                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                                                                        color: "primary.main",
                                                                        "&:hover": { bgcolor: "primary.main", color: "white" }
                                                                    }}
                                                                >
                                                                    <RefreshCw size={18} />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </>
                                                    )}
                                                    <Tooltip title="View Summary">
                                                        <IconButton 
                                                            onClick={() => handleOpenDetails(appointment)}
                                                            sx={{ 
                                                                borderRadius: 2, 
                                                                bgcolor: alpha(theme.palette.text.primary, 0.05),
                                                                color: "text.primary"
                                                            }}
                                                        >
                                                            <Eye size={18} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Box sx={{ py: 6 }}>
                        <EmptyState 
                            title="No Appointments Found"
                            message="You haven't scheduled any consultations yet. Ready to meet a specialist?" 
                            action={{ label: "Book Appointment", path: "/patient/doctors" }}
                            icon={Calendar}
                        />
                    </Box>
                )}
                </SectionCard>
            )}

            <AppointmentDetailsModal 
                open={detailsModalOpen}
                onClose={handleCloseDialogs}
                appointment={selectedAppointment}
            />

            <Dialog 
                open={cancelDialogOpen} 
                onClose={handleCloseDialogs}
                PaperProps={{ sx: { borderRadius: 4, width: '100%', maxWidth: 450 } }}
            >
                <DialogTitle sx={{ p: 3, pb: 0 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{ p: 1, borderRadius: 2, bgcolor: alpha(theme.palette.error.main, 0.1), color: 'error.main', display: 'flex' }}>
                            <AlertTriangle size={24} />
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 900 }}>Cancel Consultation?</Typography>
                    </Stack>
                </DialogTitle>
                <DialogContent sx={{ p: 3 }}>
                    <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500, lineHeight: 1.6 }}>
                        You are about to cancel your appointment with <Box component="span" sx={{ fontWeight: 800, color: 'text.primary' }}>Dr. {selectedAppointment?.doctor?.user?.fullName}</Box> on <Box component="span" sx={{ fontWeight: 800, color: 'text.primary' }}>{selectedAppointment && format(parseISO(selectedAppointment.appointmentDate), "PPP")}</Box>.
                    </Typography>
                    <Typography variant="body2" color="error.main" sx={{ mt: 2, fontWeight: 700 }}>
                        This action is irreversible.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 0 }}>
                    <Button 
                        onClick={handleCloseDialogs} 
                        sx={{ fontWeight: 800, textTransform: 'none', color: 'text.secondary' }}
                    >
                        Go Back
                    </Button>
                    <Button 
                        variant="contained" 
                        color="error" 
                        onClick={handleConfirmCancel}
                        disabled={isActionLoading}
                        sx={{ 
                            borderRadius: 2.5, 
                            fontWeight: 800, 
                            textTransform: 'none',
                            px: 3,
                            boxShadow: `0 8px 16px ${alpha(theme.palette.error.main, 0.2)}`
                        }}
                    >
                        {isActionLoading ? "Cancelling..." : "Confirm Cancellation"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default MyAppointmentsPage;
