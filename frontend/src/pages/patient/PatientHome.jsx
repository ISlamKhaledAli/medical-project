import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
    Box, 
    Typography, 
    Grid, 
    Avatar,
    Stack,
    Button,
    alpha,
    useTheme,
    Paper
} from "@mui/material";
import { 
    Search as SearchIcon, 
    Calendar as AppointmentsIcon, 
    User as ProfileIcon,
    ArrowRight as ArrowIcon,
    CheckCircle2 as ConfirmedIcon,
    Clock as PendingIcon,
    PlusCircle,
    Activity,
    ClipboardList
} from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import { fetchMyAppointments } from "../../features/appointment/appointmentSlice";
import { format, isToday, parseISO } from "date-fns";
import StatCard from "../../components/ui/StatCard";
import SectionCard from "../../components/ui/SectionCard";
import PageHeader from "../../components/ui/PageHeader";
import EmptyState from "../../components/ui/EmptyState";

const PatientHome = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const { user } = useSelector((state) => state.auth);
    const { appointments } = useSelector((state) => state.appointment);

    useEffect(() => {
        dispatch(fetchMyAppointments());
    }, [dispatch]);

    const stats = useMemo(() => {
        const confirmed = (appointments || []).filter(a => a.status === "confirmed").length;
        const pending = (appointments || []).filter(a => a.status === "pending").length;
        const total = (appointments || []).length;
        
        return { total, confirmed, pending };
    }, [appointments]);

    const upcoming = useMemo(() => {
        return (appointments || [])
            .filter(a => ["pending", "confirmed"].includes(a.status))
            .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
            .slice(0, 4);
    }, [appointments]);

    const todayAppointments = useMemo(() => {
        return (appointments || []).filter(a => {
            try {
                return a.appointmentDate && isToday(parseISO(a.appointmentDate));
            } catch (e) {
                return false;
            }
        });
    }, [appointments]);

    return (
        <Box>
            <PageHeader 
                title={`Welcome, ${user?.fullName?.split(" ")?.[0] || "User"}!`}
                subtitle="Your health journey starts here. Manage your records and appointments with ease."
                breadcrumbs={[
                    { label: "Dashboard", active: true }
                ]}
                action={{
                    label: "Find a Doctor",
                    icon: PlusCircle,
                    path: "/patient/doctors"
                }}
            />

            {/* Quick Stats Overview */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard 
                        title="Total Visits" 
                        value={stats.total} 
                        icon={Activity}
                        duration="Cumulative"
                        color="primary"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard 
                        title="Confirmed" 
                        value={stats.confirmed} 
                        icon={ConfirmedIcon}
                        color="success"
                        trend={{ value: "Next visit soon", isUp: true }}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard 
                        title="Pending Approvals" 
                        value={stats.pending} 
                        icon={PendingIcon}
                        color="warning"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <StatCard 
                      title="Today's Care" 
                      value={todayAppointments.length} 
                      icon={AppointmentsIcon}
                      color="info"
                      subtitle={todayAppointments.length > 0 ? "You have sessions today" : "No sessions scheduled today"}
                  />
                </Grid>
            </Grid>

            <Grid container spacing={4}>
                {/* Left Side: Upcoming Appointments */}
                <Grid size={{ xs: 12, lg: 8 }}>
                    <SectionCard 
                        title="Upcoming Appointments" 
                        action={{ 
                            label: "View All", 
                            path: "/patient/appointments",
                            icon: ArrowIcon 
                        }}
                    >
                        {upcoming.length > 0 ? (
                            <Stack spacing={2} sx={{ mt: 1 }}>
                                {upcoming.map((apt) => (
                                    <Box 
                                        key={apt._id}
                                        sx={{ 
                                            p: 2, 
                                            borderRadius: 3, 
                                            border: "1px solid", 
                                            borderColor: "divider",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 2,
                                            transition: "0.2s",
                                            "&:hover": {
                                                bgcolor: alpha(theme.palette.primary.main, 0.01),
                                                borderColor: "primary.light"
                                            }
                                        }}
                                    >
                                        <Avatar 
                                            src={apt.doctor?.user?.profileImage}
                                            sx={{ width: 56, height: 56, borderRadius: 2, bgcolor: "primary.main" }}
                                        >
                                            {apt.doctor?.user?.fullName?.[0]}
                                        </Avatar>
                                        
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                                                Dr. {apt.doctor?.user?.fullName}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                                {apt.doctor?.specialty?.name || "Medical Specialist"}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ textAlign: 'right', px: 2 }}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "text.primary" }}>
                                                {apt.appointmentDate ? format(parseISO(apt.appointmentDate), "MMM dd, yyyy") : "Date TBD"}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                                                {apt.startTime || "--:--"}
                                            </Typography>
                                        </Box>

                                        <Box 
                                            sx={{ 
                                                px: 2, 
                                                py: 0.8, 
                                                borderRadius: 2, 
                                                bgcolor: apt.status === 'confirmed' ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.warning.main, 0.1),
                                                color: apt.status === 'confirmed' ? 'success.main' : 'warning.main',
                                                minWidth: 90,
                                                textAlign: 'center'
                                            }}
                                        >
                                            <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase' }}>
                                                {apt.status}
                                            </Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Stack>
                        ) : (
                            <EmptyState 
                                title="No Upcoming Visits"
                                message="You don't have any pending or confirmed appointments scheduled at the moment."
                                icon={ClipboardList}
                                action={{
                                    label: "Find a Doctor",
                                    path: "/patient/doctors"
                                }}
                            />
                        )}
                    </SectionCard>
                </Grid>

                {/* Right Side: Quick Actions & Education */}
                <Grid size={{ xs: 12, lg: 4 }}>
                    <Stack spacing={3}>
                        <SectionCard title="Quick Resources">
                            <Stack spacing={2} sx={{ mt: 1 }}>
                                {[
                                    { icon: SearchIcon, title: "Find Specialists", desc: "Browse medical experts by specialty", path: "/patient/doctors", color: "primary" },
                                    { icon: ClipboardList, title: "Lab Results", desc: "View your latest diagnostic reports", path: "#", color: "info" },
                                    { icon: ProfileIcon, title: "Health Profile", desc: "Update your medical history", path: "/patient/profile", color: "secondary" }
                                ].map((action, i) => (
                                    <Box 
                                        key={i}
                                        component={RouterLink}
                                        to={action.path}
                                        sx={{ 
                                            p: 2, 
                                            borderRadius: 3, 
                                            bgcolor: alpha(theme.palette[action.color].main, 0.05),
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 2,
                                            textDecoration: "none",
                                            transition: "0.2s",
                                            "&:hover": {
                                                bgcolor: alpha(theme.palette[action.color].main, 0.1),
                                                transform: "translateX(4px)"
                                            }
                                        }}
                                    >
                                        <Box sx={{ color: `${action.color}.main` }}>
                                            <action.icon size={24} />
                                        </Box>
                                        <Box>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "text.primary" }}>{action.title}</Typography>
                                            <Typography variant="caption" color="text.secondary">{action.desc}</Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Stack>
                        </SectionCard>

                        <Paper 
                            sx={{ 
                                p: 3, 
                                borderRadius: 4, 
                                bgcolor: "primary.main", 
                                color: "white",
                                position: "relative",
                                overflow: "hidden"
                            }}
                        >
                            <Box sx={{ position: "relative", zIndex: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>Need Urgent Care?</Typography>
                                <Typography variant="body2" sx={{ opacity: 0.9, mb: 2.5 }}>
                                    Find a doctor who's available right now for an immediate consultation.
                                </Typography>
                                <Button 
                                    variant="contained" 
                                    size="small"
                                    sx={{ 
                                        bgcolor: "white", 
                                        color: "primary.main", 
                                        fontWeight: 800,
                                        "&:hover": { bgcolor: alpha("#fff", 0.9) }
                                    }}
                                >
                                    Check Availability
                                </Button>
                            </Box>
                            {/* Decorative cross */}
                            <PlusCircle 
                                size={120} 
                                style={{ 
                                    position: "absolute", 
                                    right: -20, 
                                    bottom: -20, 
                                    opacity: 0.1, 
                                    transform: "rotate(-15deg)" 
                                }} 
                            />
                        </Paper>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
};

export default PatientHome;
