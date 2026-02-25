import { useEffect, useState, useCallback } from "react";
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
    Alert,
    LinearProgress
} from "@mui/material";
import { 
    fetchAllAppointments, 
    approveAppointment, 
    cancelAppointment, 
    deleteAppointment 
} from "../../features/admin/adminSlice";
import AdminAppointmentRow from "../../components/appointment/AdminAppointmentRow";
import AppointmentDetailsModal from "../../components/appointment/AppointmentDetailsModal";

const AllAppointmentsPage = () => {
    const dispatch = useDispatch();
    const { appointments, isLoading, actionLoadingStates, error } = useSelector((state) => state.admin);
    
    // Modal states
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [detailsOpen, setDetailsOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchAllAppointments());
    }, [dispatch]);

    // Handlers
    const handleViewDetails = useCallback((appointment) => {
        setSelectedAppointment(appointment);
        setDetailsOpen(true);
    }, []);

    const handleApprove = useCallback((id) => {
        dispatch(approveAppointment(id));
    }, [dispatch]);

    const handleCancel = useCallback((id) => {
        if (window.confirm("Are you sure you want to cancel this appointment?")) {
            dispatch(cancelAppointment(id));
        }
    }, [dispatch]);

    const handleDelete = useCallback((id) => {
        if (window.confirm("CRITICAL ACTION: Are you sure you want to PERMANENTLY DELETE this record? This cannot be undone.")) {
            dispatch(deleteAppointment(id));
        }
    }, [dispatch]);

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 5 }}>
                <Typography variant="h4" sx={{ fontWeight: 900, color: "#1a237e", mb: 1 }}>
                    Appointments Management
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Monitor and manage all consultations across the medical network.
                </Typography>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                    {error}
                </Alert>
            )}

            <TableContainer 
                component={Paper} 
                elevation={0} 
                sx={{ 
                    borderRadius: 4, 
                    border: "1px solid rgba(0,0,0,0.05)",
                    overflow: "hidden",
                    position: "relative"
                }}
            >
                {isLoading && <LinearProgress sx={{ position: "absolute", top: 0, left: 0, right: 0, height: 3 }} />}
                
                <Table sx={{ minWidth: 800 }}>
                    <TableHead sx={{ bgcolor: "rgba(0,0,0,0.02)" }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>Patient Information</TableCell>
                            <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>Doctor & Specialty</TableCell>
                            <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>Schedule</TableCell>
                            <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>Current Status</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 800, color: "text.secondary" }}>Admin Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {!isLoading && appointments.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                                    <Typography color="text.secondary">No appointments found in the system.</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            appointments.map((appointment) => (
                                <AdminAppointmentRow 
                                    key={appointment._id} 
                                    appointment={appointment}
                                    onView={handleViewDetails}
                                    onApprove={handleApprove}
                                    onCancel={handleCancel}
                                    onDelete={handleDelete}
                                    isLoading={!!actionLoadingStates[appointment._id]}
                                />
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Details Modal */}
            <AppointmentDetailsModal 
                open={detailsOpen}
                onClose={() => setDetailsOpen(false)}
                appointment={selectedAppointment}
            />
        </Container>
    );
};

export default AllAppointmentsPage;
