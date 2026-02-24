import { useEffect } from "react";
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
    Paper
} from "@mui/material";
import { 
    Search as SearchIcon, 
    EventNote as AppointmentsIcon, 
    Person as ProfileIcon,
    ArrowForward as ArrowIcon,
    CheckCircle as ConfirmedIcon,
    Schedule as PendingIcon
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { fetchMyAppointments } from "../../features/appointment/appointmentSlice";
import { format } from "date-fns";

const ActionCard = ({ title, description, icon: Icon, path, color }) => (
    <Card 
        component={RouterLink}
        to={path}
        sx={{ 
            height: "100%", 
            borderRadius: 4, 
            textDecoration: "none",
            transition: "0.3s",
            "&:hover": { 
                transform: "translateY(-5px)",
                boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
            }
        }}
    >
        <CardContent sx={{ p: 4 }}>
            <Box sx={{ 
                p: 2, 
                borderRadius: 3, 
                bgcolor: `${color}.light`, 
                color: `${color}.main`, 
                width: "fit-content",
                mb: 3
            }}>
                <Icon fontSize="large" />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: "text.primary" }}>
                {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {description}
            </Typography>
        </CardContent>
    </Card>
);

const PatientHome = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { appointments } = useSelector((state) => state.appointment);

    useEffect(() => {
        dispatch(fetchMyAppointments());
    }, [dispatch]);

    const upcoming = appointments
        .filter(a => ["pending", "confirmed"].includes(a.status))
        .slice(0, 3);

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            {/* Welcome Section */}
            <Box sx={{ mb: 6 }}>
                <Typography variant="h3" sx={{ fontWeight: 900, color: "#1a237e", mb: 1.5 }}>
                    Welcome, {user?.fullName?.split(" ")?.[0] || user?.name || "User"}!
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500, opacity: 0.8 }}>
                    Your health journey starts here. How can we help you today?
                </Typography>
            </Box>

            {/* Quick Actions */}
            <Grid container spacing={4} sx={{ mb: 8 }}>
                <Grid item xs={12} md={4}>
                    <ActionCard 
                        title="Find Doctors" 
                        description="Book consultations with specialized medical experts."
                        icon={SearchIcon}
                        path="/patient/doctors"
                        color="primary"
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <ActionCard 
                        title="My Appointments" 
                        description="View, reschedule or cancel your medical visits."
                        icon={AppointmentsIcon}
                        path="/patient/appointments"
                        color="success"
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <ActionCard 
                        title="Edit Profile" 
                        description="Keep your personal and medical information up to date."
                        icon={ProfileIcon}
                        path="/patient/profile"
                        color="info"
                    />
                </Grid>
            </Grid>

            {/* Upcoming Appointments Preview */}
            <Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 800 }}>
                        Your Next Appointments
                    </Typography>
                    <Button 
                        component={RouterLink} 
                        to="/patient/appointments" 
                        endIcon={<ArrowIcon />}
                        sx={{ textTransform: "none", fontWeight: 700 }}
                    >
                        See All
                    </Button>
                </Box>

                {upcoming.length > 0 ? (
                    <Grid container spacing={3}>
                        {upcoming.map((apt) => (
                            <Grid item xs={12} md={4} key={apt._id}>
                                <Paper sx={{ p: 3, borderRadius: 4, border: "1px solid rgba(0,0,0,0.05)" }}>
                                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                                        <Avatar sx={{ bgcolor: "primary.main" }}>{apt.doctor?.user?.fullName?.[0] || 'D'}</Avatar>
                                        <Box>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                                                Dr. {apt.doctor?.user?.fullName}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {apt.doctor?.specialty?.name}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                    <Box sx={{ py: 1.5, borderTop: "1px solid rgba(0,0,0,0.05)", borderBottom: "1px solid rgba(0,0,0,0.05)", mb: 2 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 1 }}>
                                            📅 {apt.appointmentDate ? format(new Date(apt.appointmentDate), "MMM dd, yyyy") : "Date TBD"}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                            🕒 {apt.startTime || "--:--"} - {apt.endTime || "--:--"}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        {apt.status === "confirmed" ? (
                                            <ConfirmedIcon color="success" fontSize="small" />
                                        ) : (
                                            <PendingIcon color="warning" fontSize="small" />
                                        )}
                                        <Typography variant="caption" sx={{ textTransform: "capitalize", fontWeight: 700, color: apt.status === "confirmed" ? "success.main" : "warning.main" }}>
                                            {apt.status}
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Paper 
                        elevation={0} 
                        sx={{ 
                            p: 6, 
                            borderRadius: 4, 
                            bgcolor: "rgba(0,0,0,0.01)", 
                            border: "1px dashed rgba(0,0,0,0.1)",
                            textAlign: "center"
                        }}
                    >
                        <Typography color="text.secondary" sx={{ fontWeight: 600 }}>
                            No upcoming appointments. Need medical advice? 
                            <Button component={RouterLink} to="/patient/doctors" size="small" sx={{ ml: 1, fontWeight: 700 }}>
                                Book a Doctor
                            </Button>
                        </Typography>
                    </Paper>
                )}
            </Box>
        </Container>
    );
};

export default PatientHome;
