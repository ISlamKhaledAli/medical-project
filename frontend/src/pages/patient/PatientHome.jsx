import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
    Box, 
    Container, 
    Typography, 
    Grid, 
    Card, 
    CardContent, 
    Button, 
    Avatar,
    Stack,
    Paper,
    Chip,
    CircularProgress,
    Divider
} from "@mui/material";
import { 
    Search as SearchIcon, 
    EventNote as AppointmentsIcon, 
    Person as ProfileIcon,
    ArrowForward as ArrowIcon,
    CheckCircle as ConfirmedIcon,
    Schedule as ScheduleIcon,
    Star as StarIcon,
    History as HistoryIcon,
    MedicalServices as MedicalIcon
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { fetchMyAppointments } from "../../features/appointment/appointmentSlice";
import { fetchDoctors } from "../../features/doctor/doctorSlice";
import { format } from "date-fns";

// Action Card Component
const ActionCard = ({ title, description, icon: Icon, path, color }) => (
    <Card 
        component={RouterLink}
        to={path}
        sx={{ 
            height: "100%", 
            borderRadius: 3, 
            textDecoration: "none",
            transition: "0.3s",
            border: "1px solid rgba(0,0,0,0.05)",
            "&:hover": { 
                transform: "translateY(-4px)",
                boxShadow: "0 12px 24px rgba(0,0,0,0.1)"
            }
        }}
    >
        <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <Box sx={{ 
                p: 2, 
                borderRadius: 3, 
                bgcolor: `${color}.light`, 
                color: `${color}.main`, 
                width: "fit-content",
                mb: 2
            }}>
                <Icon fontSize="large" />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, color: "text.primary" }}>
                {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                {description}
            </Typography>
        </CardContent>
    </Card>
);

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, color, bgColor }) => (
    <Paper 
        elevation={0}
        sx={{ 
            p: 3, 
            borderRadius: 3, 
            border: "1px solid rgba(0,0,0,0.05)",
            bgcolor: bgColor || 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            transition: '0.3s',
            '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
            }
        }}
    >
        <Box sx={{ 
            p: 1.5, 
            borderRadius: 2, 
            bgcolor: `${color}.light`, 
            color: `${color}.main`,
            display: 'flex'
        }}>
            <Icon />
        </Box>
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: `${color}.main`, lineHeight: 1 }}>
                {value}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                {title}
            </Typography>
        </Box>
    </Paper>
);

// Doctor Card Component
const DoctorCard = ({ doctor, compact = false }) => (
    <Paper 
        component={RouterLink}
        to={`/patient/doctors/${doctor._id}`}
        elevation={0}
        sx={{ 
            p: 2.5, 
            borderRadius: 3, 
            border: "1px solid rgba(0,0,0,0.05)",
            textDecoration: 'none',
            transition: '0.3s',
            '&:hover': { 
                transform: 'translateY(-3px)', 
                boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                borderColor: 'primary.light'
            }
        }}
    >
        <Stack direction="row" spacing={2} alignItems="center">
            <Avatar 
                sx={{ 
                    bgcolor: "primary.main", 
                    width: compact ? 45 : 55, 
                    height: compact ? 45 : 55,
                    fontSize: compact ? '1rem' : '1.2rem',
                    fontWeight: 700
                }}
            >
                {doctor.user?.fullName?.[0] || 'D'}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    Dr. {doctor.user?.fullName}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                    {doctor.specialty?.name || "General Medicine"}
                </Typography>
                {!compact && doctor.rating && (
                    <Chip 
                        icon={<StarIcon sx={{ fontSize: '12px !important' }} />}
                        label={`${doctor.rating}/5`}
                        size="small"
                        color="warning"
                        variant="outlined"
                        sx={{ mt: 1, height: 22, fontSize: '0.7rem' }}
                    />
                )}
            </Box>
            {!compact && (
                <ArrowIcon sx={{ color: 'text.disabled' }} />
            )}
        </Stack>
    </Paper>
);

// Appointment Card Component
const AppointmentCard = ({ appointment }) => (
    <Paper 
        elevation={0}
        sx={{ 
            p: 2.5, 
            borderRadius: 3, 
            border: "1px solid rgba(0,0,0,0.05)",
            transition: '0.3s',
            '&:hover': {
                borderColor: 'primary.light',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }
        }}
    >
        <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: "primary.light", color: "primary.main", width: 45, height: 45 }}>
                {appointment.doctor?.user?.fullName?.[0] || 'D'}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    Dr. {appointment.doctor?.user?.fullName}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    {appointment.doctor?.specialty?.name}
                </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {appointment.appointmentDate ? format(new Date(appointment.appointmentDate), "MMM dd") : "TBD"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    {appointment.startTime || "--:--"}
                </Typography>
            </Box>
            <Chip 
                label={appointment.status}
                size="small"
                color={appointment.status === 'confirmed' ? 'success' : appointment.status === 'pending' ? 'warning' : 'default'}
                sx={{ fontWeight: 600, textTransform: 'capitalize', fontSize: '0.7rem' }}
            />
        </Stack>
    </Paper>
);

const PatientHome = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { appointments, isLoading } = useSelector((state) => state.appointment);
    const { doctors, isLoading: isLoadingDoctors } = useSelector((state) => state.doctor);

    useEffect(() => {
        dispatch(fetchMyAppointments());
        dispatch(fetchDoctors({ page: 1, limit: 10 }));
    }, [dispatch]);

    // Calculate appointment stats
    const stats = useMemo(() => {
        return {
            upcoming: (appointments || []).filter(a => ["pending", "confirmed"].includes(a.status)).length,
            completed: (appointments || []).filter(a => a.status === "completed").length,
            total: (appointments || []).length,
        };
    }, [appointments]);

    // Get upcoming appointments (first 3)
    const upcoming = useMemo(() => {
        return (appointments || [])
            .filter(a => ["pending", "confirmed"].includes(a.status))
            .slice(0, 3);
    }, [appointments]);

    // Get previously visited doctors (unique doctors from past appointments)
    const previousDoctors = useMemo(() => {
        const doctorMap = new Map();
        (appointments || [])
            .filter(a => a.status === "completed" && a.doctor?._id)
            .forEach(apt => {
                if (!doctorMap.has(apt.doctor._id)) {
                    doctorMap.set(apt.doctor._id, apt.doctor);
                }
            });
        return Array.from(doctorMap.values()).slice(0, 3);
    }, [appointments]);

    // Featured doctors (first 4)
    const featuredDoctors = useMemo(() => {
        return (doctors || []).slice(0, 4);
    }, [doctors]);

    // Get greeting based on time of day
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    };

    return (
        <Box sx={{ bgcolor: 'rgba(0,0,0,0.02)', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="lg">
                {/* Welcome Section */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: "#1a237e", mb: 0.5 }}>
                        {getGreeting()}, {user?.fullName?.split(" ")?.[0] || user?.name || "User"}! 👋
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        How can we help you with your health today?
                    </Typography>
                </Box>

                {/* Stats Cards */}
                <Grid container spacing={2} sx={{ mb: 4 }}>
                    <Grid item xs={4}>
                        <StatCard 
                            title="Upcoming" 
                            value={stats.upcoming} 
                            icon={ScheduleIcon} 
                            color="primary" 
                            bgColor="rgba(25, 118, 210, 0.04)"
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <StatCard 
                            title="Completed" 
                            value={stats.completed} 
                            icon={ConfirmedIcon} 
                            color="success"
                            bgColor="rgba(76, 175, 80, 0.04)"
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <StatCard 
                            title="Total Visits" 
                            value={stats.total} 
                            icon={MedicalIcon} 
                            color="info"
                            bgColor="rgba(2, 136, 209, 0.04)"
                        />
                    </Grid>
                </Grid>

                {/* Quick Actions */}
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>
                    Quick Actions
                </Typography>
                <Grid container spacing={2} sx={{ mb: 5 }}>
                    <Grid item xs={12} sm={4}>
                        <ActionCard 
                            title="Find Doctors" 
                            description="Browse specialists"
                            icon={SearchIcon}
                            path="/patient/doctors"
                            color="primary"
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <ActionCard 
                            title="My Appointments" 
                            description="View & manage"
                            icon={AppointmentsIcon}
                            path="/patient/appointments"
                            color="success"
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <ActionCard 
                            title="My Profile" 
                            description="Update info"
                            icon={ProfileIcon}
                            path="/patient/profile"
                            color="info"
                        />
                    </Grid>
                </Grid>

                {/* Two Column Layout */}
                <Grid container spacing={3}>
                    {/* Left Column */}
                    <Grid item xs={12} md={7}>
                        {/* Upcoming Appointments */}
                        <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid rgba(0,0,0,0.05)", mb: 3 }}>
                            <Box sx={{ p: 2.5, borderBottom: "1px solid rgba(0,0,0,0.05)", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <ScheduleIcon color="primary" fontSize="small" /> Upcoming Appointments
                                </Typography>
                                <Button 
                                    component={RouterLink} 
                                    to="/patient/appointments" 
                                    size="small"
                                    endIcon={<ArrowIcon fontSize="small" />}
                                    sx={{ textTransform: 'none', fontWeight: 600 }}
                                >
                                    View All
                                </Button>
                            </Box>
                            <Box sx={{ p: 2.5 }}>
                                {isLoading ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress size={30} /></Box>
                                ) : upcoming.length > 0 ? (
                                    <Stack spacing={2}>
                                        {upcoming.map((apt) => (
                                            <AppointmentCard key={apt._id} appointment={apt} />
                                        ))}
                                    </Stack>
                                ) : (
                                    <Box sx={{ py: 4, textAlign: 'center' }}>
                                        <Typography color="text.secondary" sx={{ mb: 2 }}>
                                            No upcoming appointments
                                        </Typography>
                                        <Button 
                                            component={RouterLink} 
                                            to="/patient/doctors" 
                                            variant="contained" 
                                            size="small"
                                        >
                                            Book Now
                                        </Button>
                                    </Box>
                                )}
                            </Box>
                        </Paper>

                        {/* Featured Doctors */}
                        <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid rgba(0,0,0,0.05)" }}>
                            <Box sx={{ p: 2.5, borderBottom: "1px solid rgba(0,0,0,0.05)", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <StarIcon color="warning" fontSize="small" /> Featured Doctors
                                </Typography>
                                <Button 
                                    component={RouterLink} 
                                    to="/patient/doctors" 
                                    size="small"
                                    endIcon={<ArrowIcon fontSize="small" />}
                                    sx={{ textTransform: 'none', fontWeight: 600 }}
                                >
                                    See All
                                </Button>
                            </Box>
                            <Box sx={{ p: 2.5 }}>
                                {isLoadingDoctors ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress size={30} /></Box>
                                ) : featuredDoctors.length > 0 ? (
                                    <Stack spacing={2}>
                                        {featuredDoctors.map((doc) => (
                                            <DoctorCard key={doc._id} doctor={doc} />
                                        ))}
                                    </Stack>
                                ) : (
                                    <Box sx={{ py: 4, textAlign: 'center' }}>
                                        <Typography color="text.secondary">
                                            No doctors available at the moment
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Right Column */}
                    <Grid item xs={12} md={5}>
                        {/* Previously Visited Doctors */}
                        {previousDoctors.length > 0 && (
                            <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid rgba(0,0,0,0.05)", mb: 3 }}>
                                <Box sx={{ p: 2.5, borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                                    <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <HistoryIcon color="primary" fontSize="small" /> Your Doctors
                                    </Typography>
                                </Box>
                                <Box sx={{ p: 2.5 }}>
                                    <Stack spacing={2}>
                                        {previousDoctors.map((doc) => (
                                            <DoctorCard key={doc._id} doctor={doc} compact />
                                        ))}
                                    </Stack>
                                </Box>
                            </Paper>
                        )}

                        {/* Health Tips / Info Card */}
                        <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid rgba(0,0,0,0.05)", bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)' }}>
                            <Box sx={{ p: 3, color: 'white', textAlign: 'center' }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                                    Stay Healthy! 🏥
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                                    Regular check-ups help prevent health issues before they become serious.
                                </Typography>
                                <Button 
                                    component={RouterLink} 
                                    to="/patient/doctors" 
                                    variant="contained"
                                    sx={{ 
                                        bgcolor: 'white', 
                                        color: '#1a237e',
                                        '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
                                        fontWeight: 700
                                    }}
                                >
                                    Book Check-up
                                </Button>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default PatientHome;

