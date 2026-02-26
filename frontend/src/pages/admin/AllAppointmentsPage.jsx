import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
    Box, 
    Alert,
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow,
    alpha,
    useTheme,
    TextField,
    InputAdornment
} from "@mui/material";
import { 
    Search,
    Calendar
} from "lucide-react";
import { 
    fetchAllAppointments, 
    approveAppointment, 
    cancelAppointment, 
    deleteAppointment 
} from "../../features/admin/adminSlice";
import AdminAppointmentRow from "../../components/appointment/AdminAppointmentRow";
import AppointmentDetailsModal from "../../components/appointment/AppointmentDetailsModal";
import PageHeader from "../../components/ui/PageHeader";
import SectionCard from "../../components/ui/SectionCard";
import TableSkeleton from "../../components/skeletons/TableSkeleton";
import EmptyState from "../../components/ui/EmptyState";

const AllAppointmentsPage = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const { appointments, isLoading, actionLoadingStates, error } = useSelector((state) => state.admin);
    
    // Modal states
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

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
        dispatch(cancelAppointment(id));
    }, [dispatch]);

    const handleDelete = useCallback((id) => {
        dispatch(deleteAppointment(id));
    }, [dispatch]);

    const filteredAppointments = (appointments || []).filter(app => 
        app.patient?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.doctor?.user?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Box>
            <PageHeader 
                title="Clinical Audit Logs"
                subtitle="High-level oversight of all medical consultations across the network. Monitor status and resolve conflicts."
                breadcrumbs={[
                    { label: "Admin", path: "/admin" },
                    { label: "Appointments", active: true }
                ]}
            />

            {error && (
                <Alert severity="error" variant="soft" sx={{ mb: 3, borderRadius: 3, fontWeight: 700 }}>
                    {error}
                </Alert>
            )}

            {isLoading ? (
                <TableSkeleton rows={8} cols={5} />
            ) : filteredAppointments.length === 0 ? (
                <SectionCard 
                    title="Network Consultations" 
                    subtitle={`${filteredAppointments.length} records identified in current scope`}
                    headerAction={
                        <TextField 
                            placeholder="Search patient or doctor..."
                            size="small"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            sx={{ 
                                minWidth: 300,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 3,
                                    bgcolor: alpha(theme.palette.background.default, 0.5),
                                }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search size={18} color={theme.palette.text.disabled} />
                                    </InputAdornment>
                                )
                            }}
                        />
                    }
                >
                    <Box sx={{ py: 6 }}>
                        <EmptyState 
                            title="No Records Found"
                            message="The clinical registry is empty or no matches were found for your search."
                            icon={Calendar}
                        />
                    </Box>
                </SectionCard>
            ) : (
                <SectionCard 
                    title="Network Consultations" 
                    subtitle={`${filteredAppointments.length} records identified in current scope`}
                    headerAction={
                        <TextField 
                            placeholder="Search patient or doctor..."
                            size="small"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            sx={{ 
                                minWidth: 300,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 3,
                                    bgcolor: alpha(theme.palette.background.default, 0.5),
                                }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search size={18} color={theme.palette.text.disabled} />
                                    </InputAdornment>
                                )
                            }}
                        />
                    }
                >
                    <TableContainer>
                        <Table sx={{ minWidth: 800 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 800, color: "text.secondary", pl: 0 }}>Subject Identity</TableCell>
                                    <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>Professional</TableCell>
                                    <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>Schedule</TableCell>
                                    <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>System Status</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 800, color: "text.secondary", pr: 0 }}>Governance</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredAppointments.map((appointment) => (
                                    <AdminAppointmentRow 
                                        key={appointment._id} 
                                        appointment={appointment}
                                        onView={handleViewDetails}
                                        onApprove={handleApprove}
                                        onCancel={handleCancel}
                                        onDelete={handleDelete}
                                        isLoading={!!actionLoadingStates[appointment._id]}
                                    />
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </SectionCard>
            )}

            <AppointmentDetailsModal 
                open={detailsOpen}
                onClose={() => setDetailsOpen(false)}
                appointment={selectedAppointment}
            />
        </Box>
    );
};

export default AllAppointmentsPage;
