import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux"; 
import { 
    Container, 
    Grid, 
    Paper, 
    Typography, 
    Box, 
    CircularProgress,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Avatar,
    Stack
} from "@mui/material";
import { 
    People as PeopleIcon, 
    EventNote as ApptIcon, 
    Verified as VerifiedIcon,
    PendingActions as PendingIcon,
    Person as PatientIcon,
    LocalHospital as DoctorIcon,
    ArrowForward as ViewMoreIcon,
    AdminPanelSettings as UsersIcon,
    EventAvailable as AppointmentsIcon,
    Category as SpecialtyIcon
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { fetchStats, fetchAllAppointments, fetchUsers } from "../../features/admin/adminSlice";
import StatusBadge from "../../components/appointment/StatusBadge";
import TableSkeleton from "../../components/skeletons/TableSkeleton";

const StatCard = ({ title, value, icon: Icon, color }) => (
    <Paper 
        elevation={0} 
        sx={{ 
            p: 3, 
            borderRadius: 4, 
            border: "1px solid rgba(0,0,0,0.05)",
            display: "flex",
            alignItems: "center",
            gap: 2
        }}
    >
        <Box 
            sx={{ 
                p: 1.5, 
                bgcolor: `${color}.light`, 
                borderRadius: 3, 
                color: `${color}.main`,
                display: "flex"
            }}
        >
            <Icon />
        </Box>
        <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{title}</Typography>
            <Typography variant="h5" sx={{ fontWeight: 900 }}>{value}</Typography>
        </Box>
    </Paper>
);

const StatsDashboard = () => {
    const dispatch = useDispatch();
    const { stats, isLoading, users } = useSelector((state) => state.admin);

    useEffect(() => {
        dispatch(fetchStats());
        dispatch(fetchAllAppointments({ page: 1, limit: 10, sort: '-createdAt' }));
        dispatch(fetchUsers({ page: 1, limit: 100 }));
    }, [dispatch]);

    // Calculate user breakdown from fetched users
    const userBreakdown = useMemo(() => {
        if (!users || users.length === 0) return { patients: 0, doctors: 0, pending: 0 };
        
        return {
            patients: users.filter(u => u.role === 'patient').length,
            doctors: users.filter(u => u.role === 'doctor').length,
            pending: users.filter(u => u.role === 'doctor' && u.status === 'pending').length
        };
    }, [users]);

    // Get recent appointments (first 5)
    const { appointments } = useSelector((state) => state.admin);
    const recentAppointments = useMemo(() => {
        return (appointments || []).slice(0, 5);
    }, [appointments]);

    if (isLoading && !stats) return <CircularProgress />;

    const data = stats || {
        totalUsers: 120,
        totalAppointments: 450,
        pendingApprovals: 12,
        activeDoctors: 45
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 5 }}>
                <Typography variant="h4" sx={{ fontWeight: 900, color: "#1a237e", mb: 1 }}>
                    System Dashboard
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Overview of system performance and active users.
                </Typography>
            </Box>

            {/* User Breakdown Cards */}
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, mt: 2 }}>
                User Overview
            </Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={4}>
                    <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: "1px solid rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: 2 }}>
                        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: "primary.light", color: "primary.main" }}>
                            <PatientIcon />
                        </Box>
                        <Box>
                            <Typography variant="caption" color="text.secondary">Patients</Typography>
                            <Typography variant="h5" sx={{ fontWeight: 800 }}>{userBreakdown.patients}</Typography>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: "1px solid rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: 2 }}>
                        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: "success.light", color: "success.main" }}>
                            <DoctorIcon />
                        </Box>
                        <Box>
                            <Typography variant="caption" color="text.secondary">Doctors</Typography>
                            <Typography variant="h5" sx={{ fontWeight: 800 }}>{userBreakdown.doctors}</Typography>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: "1px solid rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: 2 }}>
                        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: "warning.light", color: "warning.main" }}>
                            <PendingIcon />
                        </Box>
                        <Box>
                            <Typography variant="caption" color="text.secondary">Pending Doctors</Typography>
                            <Typography variant="h5" sx={{ fontWeight: 800 }}>{userBreakdown.pending}</Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* Main Stats Cards */}
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                System Statistics
            </Typography>
            <Grid container spacing={4}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Total Users" value={data.totalUsers} icon={PeopleIcon} color="primary" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Total Appointments" value={data.totalAppointments} icon={ApptIcon} color="success" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Active Doctors" value={data.activeDoctors} icon={VerifiedIcon} color="info" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Pending Approvals" value={data.pendingApprovals} icon={PendingIcon} color="warning" />
                </Grid>
            </Grid>

            {/* Quick Actions */}
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, mt: 4 }}>
                Quick Actions
            </Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={6} sm={3}>
                    <Button 
                        fullWidth 
                        variant="outlined" 
                        startIcon={<UsersIcon />}
                        component={RouterLink}
                        to="/admin/users"
                        sx={{ py: 2, borderRadius: 3, textTransform: "none", fontWeight: 600 }}
                    >
                        Manage Users
                    </Button>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <Button 
                        fullWidth 
                        variant="outlined" 
                        startIcon={<AppointmentsIcon />}
                        component={RouterLink}
                        to="/admin/appointments"
                        sx={{ py: 2, borderRadius: 3, textTransform: "none", fontWeight: 600 }}
                    >
                        All Appointments
                    </Button>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <Button 
                        fullWidth 
                        variant="outlined" 
                        startIcon={<DoctorIcon />}
                        component={RouterLink}
                        to="/admin/doctor-approvals"
                        sx={{ py: 2, borderRadius: 3, textTransform: "none", fontWeight: 600 }}
                    >
                        Doctor Approvals
                    </Button>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <Button 
                        fullWidth 
                        variant="outlined" 
                        startIcon={<SpecialtyIcon />}
                        component={RouterLink}
                        to="/admin/specialties"
                        sx={{ py: 2, borderRadius: 3, textTransform: "none", fontWeight: 600 }}
                    >
                        Specialties
                    </Button>
                </Grid>
            </Grid>

            {/* Recent Appointments */}
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Recent Appointments
            </Typography>
            <Paper elevation={0} sx={{ borderRadius: 4, border: "1px solid rgba(0,0,0,0.05)", overflow: "hidden" }}>
                {isLoading ? (
                    <Box sx={{ p: 2 }}><TableSkeleton rows={5} /></Box>
                ) : recentAppointments.length === 0 ? (
                    <Box sx={{ p: 4, textAlign: "center" }}>
                        <Typography color="text.secondary">No recent appointments</Typography>
                    </Box>
                ) : (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: "rgba(0,0,0,0.02)" }}>
                                    <TableCell sx={{ fontWeight: 700 }}>Patient</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Doctor</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {recentAppointments.map((apt) => (
                                    <TableRow key={apt._id} hover>
                                        <TableCell>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Avatar sx={{ width: 28, height: 28, fontSize: "0.8rem" }}>
                                                    {apt.patient?.fullName?.[0] || 'P'}
                                                </Avatar>
                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                    {apt.patient?.fullName || 'Unknown'}
                                                </Typography>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Avatar sx={{ width: 28, height: 28, fontSize: "0.8rem", bgcolor: "success.main" }}>
                                                    {apt.doctor?.user?.fullName?.[0] || 'D'}
                                                </Avatar>
                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                    Dr. {apt.doctor?.user?.fullName || 'Unknown'}
                                                </Typography>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {apt.appointmentDate ? new Date(apt.appointmentDate).toLocaleDateString() : 'N/A'}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {apt.startTime || '--:--'} - {apt.endTime || '--:--'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <StatusBadge status={apt.status} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
                <Box sx={{ p: 2, borderTop: "1px solid rgba(0,0,0,0.05)", display: "flex", justifyContent: "flex-end" }}>
                    <Button 
                        endIcon={<ViewMoreIcon />} 
                        component={RouterLink}
                        to="/admin/appointments"
                        sx={{ textTransform: "none", fontWeight: 600 }}
                    >
                        View All Appointments
                    </Button>
                </Box>

            </Paper>
        </Container>
    );
};



export default StatsDashboard;
