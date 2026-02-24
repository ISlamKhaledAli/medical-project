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
    IconButton
} from "@mui/material";
import { Visibility as ViewIcon } from "@mui/icons-material";
import { format } from "date-fns";
import { fetchAllAppointments } from "../../features/admin/adminSlice";
import StatusBadge from "../../components/appointment/StatusBadge";

const AllAppointmentsPage = () => {
    const dispatch = useDispatch();
    const { appointments, isLoading } = useSelector((state) => state.admin);

    useEffect(() => {
        dispatch(fetchAllAppointments());
    }, [dispatch]);

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 5 }}>
                <Typography variant="h4" sx={{ fontWeight: 900, color: "#1a237e", mb: 1 }}>
                    All Appointments
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Global view of all medical consultations in the system.
                </Typography>
            </Box>

            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, border: "1px solid rgba(0,0,0,0.05)" }}>
                <Table>
                    <TableHead sx={{ bgcolor: "rgba(0,0,0,0.02)" }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 800 }}>Patient</TableCell>
                            <TableCell sx={{ fontWeight: 800 }}>Doctor</TableCell>
                            <TableCell sx={{ fontWeight: 800 }}>Date & Time</TableCell>
                            <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 800 }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {appointments.map((appointment) => (
                            <TableRow key={appointment.id} hover>
                                <TableCell>
                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                        <Avatar sx={{ mr: 2, bgcolor: "secondary.light", color: "secondary.main" }}>
                                            {appointment.patient?.name[0]}
                                        </Avatar>
                                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                            {appointment.patient?.name}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        Dr. {appointment.doctor?.name}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {appointment.doctor?.specialty}
                                    </Typography>
                                </TableCell>
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
                                    <IconButton size="small">
                                        <ViewIcon fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default AllAppointmentsPage;
