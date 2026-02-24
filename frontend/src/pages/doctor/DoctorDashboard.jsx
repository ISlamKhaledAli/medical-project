import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
    Box, 
    Grid, 
    Typography, 
    Card, 
    CardContent, 
    Button, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper,
    Avatar,
    Chip,
    IconButton,
    Tooltip
} from "@mui/material";
import { 
    CalendarMonth as CalendarIcon,
    PendingActions as PendingIcon,
    CheckCircle as CompletedIcon,
    ArrowForward as ViewMoreIcon,
    Schedule as ScheduleIcon,
    Person as ProfileIcon,
    Check as ConfirmIcon
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { fetchMyAppointments, updateAppointmentStatus } from "../../features/appointment/appointmentSlice";
import TableSkeleton from "../../components/skeletons/TableSkeleton";
import StatusBadge from "../../components/appointment/StatusBadge";
import EmptyState from "../../components/ui/EmptyState";

const StatCard = ({ title, value, icon, color, subtitle }) => (
    <Card sx={{ height: "100%", borderRadius: 4, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
        <CardContent>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: `${color}.light`, color: `${color}.main` }}>
                    {icon}
                </Box>
                {subtitle && (
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                        {subtitle}
                    </Typography>
                )}
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
                {value}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                {title}
            </Typography>
        </CardContent>
    </Card>
);

const DoctorDashboard = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { appointments, isLoading } = useSelector((state) => state.appointment);

    useEffect(() => {
        dispatch(fetchMyAppointments());
    }, [dispatch]);

    // Derived Statistics
    const stats = useMemo(() => {
        const today = new Date().toISOString().split("T")[0];
        
        return {
            today: (appointments || []).filter(a => a?.appointmentDate?.startsWith(today)).length,
            pending: (appointments || []).filter(a => a?.status === "pending").length,
            completed: (appointments || []).filter(a => a?.status === "completed").length,
        };
    }, [appointments]);

    // Filter upcoming 5
    const upcomingAppointments = useMemo(() => {
        return appointments
            .filter(a => ["pending", "confirmed"].includes(a.status))
            .slice(0, 5);
    }, [appointments]);

    const handleUpdateStatus = (id, status) => {
        dispatch(updateAppointmentStatus({ id, status }));
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            {/* Header */}
            <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: "text.primary" }}>
                        Hey, Dr. {user?.fullName?.split(" ")?.[0] || user?.name || "Doctor"} 👋
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Here's what's happening today.
                    </Typography>
                </Box>
                <Button 
                    variant="contained" 
                    startIcon={<ScheduleIcon />}
                    component={RouterLink}
                    to="/doctor/schedule"
                    sx={{ borderRadius: 3, py: 1.2, px: 3, textTransform: "none", fontWeight: 700 }}
                >
                    Manage Schedule
                </Button>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard 
                        title="Today's Appointments" 
                        value={stats.today} 
                        icon={<CalendarIcon />} 
                        color="primary" 
                        subtitle="Real-time"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard 
                        title="Pending Confirmations" 
                        value={stats.pending} 
                        icon={<PendingIcon />} 
                        color="warning" 
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard 
                        title="Total Completed" 
                        value={stats.completed} 
                        icon={<CompletedIcon />} 
                        color="success" 
                        subtitle="This Month"
                    />
                </Grid>
            </Grid>

            {/* Main Content Grid */}
            <Grid container spacing={3}>
                {/* Upcoming Appointments */}
                <Grid item xs={12} lg={8}>
                    <Card sx={{ borderRadius: 4, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
                        <CardContent>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    Upcoming Appointments
                                </Typography>
                                <Button 
                                    endIcon={<ViewMoreIcon />} 
                                    component={RouterLink}
                                    to="/doctor/appointments"
                                    sx={{ textTransform: "none", fontWeight: 600 }}
                                >
                                    View All
                                </Button>
                            </Box>

                            {isLoading ? (
                                <TableSkeleton rows={5} />
                            ) : upcomingAppointments.length === 0 ? (
                                <Box sx={{ py: 4 }}>
                                    <EmptyState message="No upcoming appointments for now." />
                                </Box>
                            ) : (
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 700, color: "text.secondary" }}>Patient</TableCell>
                                                <TableCell sx={{ fontWeight: 700, color: "text.secondary" }}>Time</TableCell>
                                                <TableCell sx={{ fontWeight: 700, color: "text.secondary" }}>Status</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 700, color: "text.secondary" }}>Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {upcomingAppointments.map((apt) => (
                                                <TableRow key={apt._id || apt.id} hover>
                                                    <TableCell sx={{ py: 2 }}>
                                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                                            <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main", fontSize: "0.8rem" }}>
                                                                {apt.patient?.name?.[0] || "P"}
                                                            </Avatar>
                                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                                {apt.patient?.name || "Anonymous"}
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                            {apt.startTime}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {new Date(apt.appointmentDate).toLocaleDateString()}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <StatusBadge status={apt.status} />
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        {apt.status === "pending" && (
                                                            <Tooltip title="Confirm Appointment">
                                                                <IconButton 
                                                                    color="success" 
                                                                    size="small"
                                                                    onClick={() => handleUpdateStatus(apt._id || apt.id, "confirmed")}
                                                                    sx={{ bgcolor: "success.light", "&:hover": { bgcolor: "success.main", color: "white" } }}
                                                                >
                                                                    <ConfirmIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Quick Actions Side Panel */}
                <Grid item xs={12} lg={4}>
                    <Card sx={{ borderRadius: 4, height: "100%", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                                Quick Actions
                            </Typography>
                            
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    startIcon={<ProfileIcon />}
                                    component={RouterLink}
                                    to="/doctor/profile"
                                    sx={{ justifyContent: "flex-start", p: 2, borderRadius: 3, textTransform: "none" }}
                                >
                                    Update My Profile
                                </Button>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    startIcon={<ProfileIcon />} // Change to appropriate icon if available
                                    component={RouterLink}
                                    to="/doctor/patients"
                                    sx={{ justifyContent: "flex-start", p: 2, borderRadius: 3, textTransform: "none" }}
                                >
                                    My Patient List
                                </Button>
                                <Box sx={{ mt: 2, p: 3, borderRadius: 4, bgcolor: "info.light", color: "info.contrastText" }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                                        Need Help?
                                    </Typography>
                                    <Typography variant="caption" sx={{ opacity: 0.9 }}>
                                        Our support team is available 24/7 for technical assistance.
                                    </Typography>
                                    <Button size="small" variant="contained" sx={{ mt: 2, bgcolor: "white", color: "info.main", "&:hover": { bgcolor: "#f5f5f5" }, borderRadius: 2 }}>
                                        Contact Admin
                                    </Button>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DoctorDashboard;
