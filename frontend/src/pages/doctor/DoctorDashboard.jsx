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
    Tooltip,
    Stack,
    Divider,
    CircularProgress
} from "@mui/material";
import { 
    CalendarMonth as CalendarIcon,
    PendingActions as PendingIcon,
    CheckCircle as CompletedIcon,
    ArrowForward as ViewMoreIcon,
    Schedule as ScheduleIcon,
    Person as ProfileIcon,
    Check as ConfirmIcon,
    Message as MessageIcon,
    TrendingUp as WeeklyIcon,
    AccessTime as TimeIcon
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { fetchMyAppointments, updateAppointmentStatus } from "../../features/appointment/appointmentSlice";
import { fetchConversations } from "../../features/chat/chatSlice";
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
    const { conversations, isLoadingConversations } = useSelector((state) => state.chat);

    useEffect(() => {
        dispatch(fetchMyAppointments());
        dispatch(fetchConversations());
    }, [dispatch]);

    // Derived Statistics
    const stats = useMemo(() => {
        const today = new Date().toISOString().split("T")[0];
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        const startOfWeekStr = startOfWeek.toISOString().split("T")[0];
        
        return {
            today: (appointments || []).filter(a => a?.appointmentDate?.startsWith(today)).length,
            pending: (appointments || []).filter(a => a?.status === "pending").length,
            completed: (appointments || []).filter(a => a?.status === "completed").length,
            thisWeek: (appointments || []).filter(a => 
                a?.appointmentDate?.startsWith(startOfWeekStr) && 
                a?.status !== "cancelled"
            ).length,
        };
    }, [appointments]);

    // Filter upcoming 5
    const upcomingAppointments = useMemo(() => {
        return (appointments || [])
            .filter(a => ["pending", "confirmed"].includes(a.status))
            .slice(0, 5);
    }, [appointments]);

    // Today's appointments for timeline
    const todayAppointments = useMemo(() => {
        const today = new Date().toISOString().split("T")[0];
        return (appointments || [])
            .filter(a => a?.appointmentDate?.startsWith(today))
            .sort((a, b) => (a.startTime || "").localeCompare(b.startTime || ""));
    }, [appointments]);

    // Recent conversations (last 3)
    const recentConversations = useMemo(() => {
        return (conversations || []).slice(0, 3);
    }, [conversations]);

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
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard 
                        title="Today's Appointments" 
                        value={stats.today} 
                        icon={<CalendarIcon />} 
                        color="primary" 
                        subtitle="Real-time"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard 
                        title="Pending Confirmations" 
                        value={stats.pending} 
                        icon={<PendingIcon />} 
                        color="warning" 
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard 
                        title="This Week" 
                        value={stats.thisWeek} 
                        icon={<WeeklyIcon />} 
                        color="info" 
                        subtitle="Appointments"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
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
                {/* Today's Schedule Timeline */}
                <Grid item xs={12} lg={8}>
                    <Card sx={{ borderRadius: 4, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
                        <CardContent>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <TimeIcon color="primary" /> Today's Schedule
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
                            ) : todayAppointments.length === 0 ? (
                                <Box sx={{ py: 4, textAlign: "center" }}>
                                    <Typography color="text.secondary">No appointments scheduled for today.</Typography>
                                </Box>
                            ) : (
                                <Stack spacing={2}>
                                    {todayAppointments.map((apt, index) => (
                                        <Paper 
                                            key={apt._id || apt.id}
                                            elevation={0}
                                            sx={{ 
                                                p: 2, 
                                                borderRadius: 2, 
                                                border: "1px solid rgba(0,0,0,0.05)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                bgcolor: index % 2 === 0 ? "rgba(0,0,0,0.01)" : "transparent"
                                            }}
                                        >
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Box sx={{ 
                                                    minWidth: 60, 
                                                    textAlign: 'center',
                                                    py: 1,
                                                    px: 1.5,
                                                    borderRadius: 2,
                                                    bgcolor: "primary.light",
                                                    color: "primary.main"
                                                }}>
                                                    <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>
                                                        {apt.startTime || '--:--'}
                                                    </Typography>
                                                </Box>
                                                <Box>
                                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                        {apt.patient?.name || "Anonymous Patient"}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {apt.startTime || "--:--"} - {apt.endTime || "--:--"}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <StatusBadge status={apt.status} />
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
                                            </Stack>
                                        </Paper>
                                    ))}
                                </Stack>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Recent Messages */}
                <Grid item xs={12} lg={4}>
                    <Card sx={{ borderRadius: 4, boxShadow: "0 4px 12px rgba(0,0,0,0.05)", height: '100%' }}>
                        <CardContent>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <MessageIcon color="primary" /> Recent Messages
                                </Typography>
                                <Button 
                                    size="small"
                                    component={RouterLink}
                                    to="/doctor/chat"
                                    sx={{ textTransform: "none", fontWeight: 600 }}
                                >
                                    View All
                                </Button>
                            </Box>

                            {isLoadingConversations ? (
                                <Box sx={{ py: 2 }}><CircularProgress size={24} /></Box>
                            ) : recentConversations.length === 0 ? (
                                <Box sx={{ py: 4, textAlign: "center" }}>
                                    <Typography color="text.secondary" variant="body2">
                                        No recent messages.
                                    </Typography>
                                </Box>
                            ) : (
                                <Stack spacing={2}>
                                    {recentConversations.map((conv) => (
                                        <Paper 
                                            key={conv._id || conv.partnerId}
                                            elevation={0}
                                            sx={{ 
                                                p: 2, 
                                                borderRadius: 2, 
                                                border: "1px solid rgba(0,0,0,0.05)",
                                                cursor: 'pointer',
                                                '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' }
                                            }}
                                            component={RouterLink}
                                            to={`/doctor/chat/${conv.partnerId}`}
                                        >
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Avatar sx={{ bgcolor: "primary.main" }}>
                                                    {conv.partner?.fullName?.[0] || conv.partner?.name?.[0] || 'U'}
                                                </Avatar>
                                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                                                        {conv.partner?.fullName || conv.partner?.name || 'Unknown'}
                                                        {conv.unreadCount > 0 && (
                                                            <Chip 
                                                                label={conv.unreadCount} 
                                                                size="small" 
                                                                color="error" 
                                                                sx={{ height: 20, fontSize: '0.7rem' }} 
                                                            />
                                                        )}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                        {conv.lastMessage?.text || "No messages yet"}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </Paper>
                                    ))}
                                </Stack>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Upcoming Appointments - Keep for reference but hide if redundant */}
                <Grid item xs={12}>
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
            </Grid>
        </Box>
    );
};

export default DoctorDashboard;
