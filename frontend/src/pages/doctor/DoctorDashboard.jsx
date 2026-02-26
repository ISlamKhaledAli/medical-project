import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
    Box, 
    Grid, 
    Typography, 
    Button, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Avatar,
    IconButton,
    Tooltip,
    alpha,
    useTheme,
    Stack,
    Paper
} from "@mui/material";
import { 
    Calendar as CalendarIcon,
    Clock as PendingIcon,
    CheckCircle2 as CompletedIcon,
    ArrowRight as ViewMoreIcon,
    CalendarDays as ScheduleIcon,
    Check as ConfirmIcon,
    Users,
    ClipboardList,
    AlertCircle
} from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import { fetchMyAppointments, updateAppointmentStatus } from "../../features/appointment/appointmentSlice";
import TableSkeleton from "../../components/skeletons/TableSkeleton";
import StatusBadge from "../../components/appointment/StatusBadge";
import StatCard from "../../components/ui/StatCard";
import SectionCard from "../../components/ui/SectionCard";
import PageHeader from "../../components/ui/PageHeader";
import EmptyState from "../../components/ui/EmptyState";

const DoctorDashboard = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const { user } = useSelector((state) => state.auth);
    const { appointments, isLoading } = useSelector((state) => state.appointment);

    useEffect(() => {
        dispatch(fetchMyAppointments());
    }, [dispatch]);

    // Derived Statistics
    const stats = useMemo(() => {
        const todayStr = new Date().toISOString().split("T")[0];
        
        return {
            today: (appointments || []).filter(a => a?.appointmentDate?.startsWith(todayStr)).length,
            pending: (appointments || []).filter(a => a?.status === "pending").length,
            completed: (appointments || []).filter(a => a?.status === "completed").length,
            total: (appointments || []).length
        };
    }, [appointments]);

    // Filter upcoming 5
    const upcomingAppointments = useMemo(() => {
        return (appointments || [])
            .filter(a => ["pending", "confirmed"].includes(a.status))
            .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
            .slice(0, 5);
    }, [appointments]);

    const handleUpdateStatus = (id, status) => {
        dispatch(updateAppointmentStatus({ id, status }));
    };

    return (
        <Box>
            <PageHeader 
                title={`Hey, Dr. ${user?.fullName?.split(" ")?.[0] || "Doctor"} 👋`}
                subtitle="Welcome to your medical command center. Here's your schedule for today."
                breadcrumbs={[{ label: "Dashboard", active: true }]}
                action={{
                    label: "Manage Schedule",
                    icon: ScheduleIcon,
                    path: "/doctor/schedule"
                }}
            />

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }} sx={{ display: "flex" }}>
                    <StatCard 
                        title="Today's visits" 
                        value={stats.today} 
                        icon={CalendarIcon} 
                        color="primary" 
                        duration="Real-time"
                        trend={{ value: "12% more than yesterday", isUp: true }}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }} sx={{ display: "flex" }}>
                    <StatCard 
                        title="Pending Review" 
                        value={stats.pending} 
                        icon={PendingIcon} 
                        color="warning" 
                        subtitle="Action required"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }} sx={{ display: "flex" }}>
                    <StatCard 
                        title="Completed" 
                        value={stats.completed} 
                        icon={CompletedIcon} 
                        color="success" 
                        duration="This Month"
                        trend={{ value: "4% growth", isUp: true }}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }} sx={{ display: "flex" }}>
                    <StatCard 
                        title="Total Patients" 
                        value={stats.total} 
                        icon={Users} 
                        color="info" 
                        duration="All time"
                    />
                </Grid>
            </Grid>

            {/* Main Content Grid */}
            <Grid container spacing={4}>
                {/* Upcoming Appointments */}
                <Grid size={{ xs: 12, lg: 8 }}>
                    <SectionCard 
                        title="Upcoming Appointments" 
                        action={{ 
                            label: "View All", 
                            path: "/doctor/appointments",
                            icon: ViewMoreIcon
                        }}
                    >
                        {isLoading ? (
                            <TableSkeleton rows={5} />
                        ) : upcomingAppointments.length === 0 ? (
                            <EmptyState 
                                title="Quiet Day Today"
                                message="No pending or confirmed appointments found for the upcoming days."
                                icon={ClipboardList}
                            />
                        ) : (
                            <TableContainer sx={{ mt: 1 }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 800, color: "text.secondary", pl: 0 }}>Patient</TableCell>
                                            <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>Date & Time</TableCell>
                                            <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>Status</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 800, color: "text.secondary", pr: 0 }}>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {upcomingAppointments.map((apt) => (
                                            <TableRow key={apt._id || apt.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                                                <TableCell sx={{ py: 2, pl: 0 }}>
                                                    <Stack direction="row" spacing={2} alignItems="center">
                                                        <Avatar 
                                                            sx={{ 
                                                                width: 40, 
                                                                height: 40, 
                                                                borderRadius: 2,
                                                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                                color: "primary.main",
                                                                fontWeight: 800,
                                                                fontSize: "0.9rem"
                                                            }}
                                                        >
                                                            {apt.patient?.fullName?.[0] || apt.patient?.name?.[0] || "P"}
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                                                                {apt.patient?.fullName || apt.patient?.name || "Patient"}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                                                                ID: {apt._id?.slice(-6).toUpperCase()}
                                                            </Typography>
                                                        </Box>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                                        {apt.startTime || "--:--"}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                                                        {new Date(apt.appointmentDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <StatusBadge status={apt.status} />
                                                </TableCell>
                                                <TableCell align="right" sx={{ pr: 0 }}>
                                                    {apt.status === "pending" ? (
                                                        <Tooltip title="Confirm Appointment">
                                                            <IconButton 
                                                                onClick={() => handleUpdateStatus(apt._id || apt.id, "confirmed")}
                                                                sx={{ 
                                                                    bgcolor: alpha(theme.palette.success.main, 0.1), 
                                                                    color: "success.main",
                                                                    borderRadius: 2,
                                                                    "&:hover": { bgcolor: "success.main", color: "white" } 
                                                                }}
                                                            >
                                                                <ConfirmIcon size={18} />
                                                            </IconButton>
                                                        </Tooltip>
                                                    ) : (
                                                        <Tooltip title="View Details">
                                                            <IconButton 
                                                                component={RouterLink}
                                                                to={`/doctor/appointments/${apt._id}`}
                                                                sx={{ 
                                                                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                                                                    color: "primary.main",
                                                                    borderRadius: 2
                                                                }}
                                                            >
                                                                <ViewMoreIcon size={18} />
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
                    </SectionCard>
                </Grid>

                {/* Side Panel: Schedule Summary */}
                <Grid size={{ xs: 12, lg: 4 }}>
                    <Stack spacing={3}>
                        <SectionCard title="Today's Timeline">
                            {stats.today > 0 ? (
                                <Stack spacing={2} sx={{ mt: 1 }}>
                                    <AlertCircle size={20} color={theme.palette.primary.main} style={{ marginBottom: 8 }} />
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                        You have <Box component="span" sx={{ fontWeight: 800, color: "primary.main" }}>{stats.today}</Box> consultations scheduled for today.
                                    </Typography>
                                    <Button 
                                        variant="outlined" 
                                        fullWidth 
                                        sx={{ borderRadius: 2, py: 1, fontWeight: 700, mt: 2 }}
                                        component={RouterLink}
                                        to="/doctor/schedule"
                                    >
                                        View Full Timeline
                                    </Button>
                                </Stack>
                            ) : (
                                <Box sx={{ py: 2, textAlign: 'center' }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                        No appointments scheduled for today.
                                    </Typography>
                                </Box>
                            )}
                        </SectionCard>

                        <Paper 
                            elevation={0}
                            sx={{ 
                                p: 3, 
                                borderRadius: 4, 
                                bgcolor: alpha(theme.palette.secondary.main, 0.05),
                                border: "1px solid",
                                borderColor: alpha(theme.palette.secondary.main, 0.1)
                            }}
                        >
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "secondary.dark", mb: 1 }}>
                                Efficiency Tip
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, lineHeight: 1.6 }}>
                                Confirming your pending appointments early helps patients plan their visit and reduces no-shows.
                            </Typography>
                        </Paper>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DoctorDashboard;
