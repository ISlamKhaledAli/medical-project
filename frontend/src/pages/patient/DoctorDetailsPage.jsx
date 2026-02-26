import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
    Grid, 
    Box, 
    Typography, 
    Avatar, 
    Button, 
    Chip, 
    Rating, 
    Divider,
    Stack,
    alpha,
    useTheme,
    Paper
} from "@mui/material";
import { 
    MapPin, 
    Building,
    GraduationCap,
    Languages,
    Clock,
    Award,
    CalendarCheck,
    ChevronLeft,
    CheckCircle2,
    Heart,
    DollarSign,
    Users
} from "lucide-react";
import { fetchDoctorById, clearDoctorDetails } from "../../features/doctor/doctorSlice";
import PageHeader from "../../components/ui/PageHeader";
import SectionCard from "../../components/ui/SectionCard";
import GlobalLoader from "../../components/ui/GlobalLoader";
import ErrorState from "../../components/ui/ErrorState";

const DoctorDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const theme = useTheme();
    const { doctorDetails: doctor, isLoading, error } = useSelector((state) => state.doctor);

    useEffect(() => {
        dispatch(fetchDoctorById(id));
        return () => dispatch(clearDoctorDetails());
    }, [dispatch, id]);

    if (isLoading) return <GlobalLoader message="Retrieving clinical profile..." />;

    if (error || !doctor) return (
        <Box sx={{ p: 4 }}>
            <ErrorState 
                message={error || "The requested specialist profile is unavailable."} 
                onRetry={() => dispatch(fetchDoctorById(id))} 
            />
        </Box>
    );

    return (
        <Box>
            <PageHeader 
                title={`Dr. ${doctor.user?.fullName}`}
                subtitle={`${doctor.specialty?.name || "Specialist"} • ${doctor.experienceYears || "15+"} Years Experience`}
                breadcrumbs={[
                    { label: "Doctors", path: "/patient/doctors" },
                    { label: "Profile Details", active: true }
                ]}
                action={{
                    label: "Return to Search",
                    icon: ChevronLeft,
                    onClick: () => navigate("/patient/doctors")
                }}
            />

            <Grid container spacing={4}>
                {/* Profile Card Sidebar */}
                <Grid item xs={12} lg={4}>
                    <SectionCard 
                        sx={{ 
                            position: "sticky", 
                            top: 100,
                            textAlign: "center"
                        }}
                    >
                        <Avatar 
                            src={doctor.user?.profileImage} 
                            sx={{ 
                                width: 140, 
                                height: 140, 
                                mx: "auto", 
                                mb: 3, 
                                border: `6px solid ${alpha(theme.palette.primary.main, 0.05)}`,
                                boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                                borderRadius: 5
                            }} 
                        >
                            {doctor.user?.fullName?.[0]}
                        </Avatar>
                        
                        <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>
                            Dr. {doctor.user?.fullName}
                        </Typography>
                        
                        <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 3 }}>
                            <Chip 
                                label={doctor.specialty?.name} 
                                size="small"
                                sx={{ 
                                    fontWeight: 800, 
                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                    color: 'primary.main',
                                    borderRadius: 1.5
                                }} 
                            />
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 1.5, py: 0.5, borderRadius: 1.5, bgcolor: alpha(theme.palette.warning.main, 0.1), color: 'warning.dark' }}>
                                <Rating value={doctor.rating || 4.8} readOnly precision={0.5} size="small" />
                                <Typography variant="caption" sx={{ fontWeight: 800 }}>{doctor.rating || 4.8}</Typography>
                            </Box>
                        </Stack>

                        <Divider sx={{ mb: 3, borderStyle: 'dashed' }} />

                        <Stack spacing={2} sx={{ textAlign: 'left', mb: 4 }}>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <MapPin size={18} color={theme.palette.primary.main} />
                                <Box>
                                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'block' }}>Clinical Address</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{doctor.address || "Medical Plaza, NYC East 42nd"}</Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Building size={18} color={theme.palette.primary.main} />
                                <Box>
                                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'block' }}>Primary Hospital</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{doctor.hospitalName || "Central Hope Research Hospital"}</Typography>
                                </Box>
                            </Box>
                        </Stack>

                        <Button 
                            fullWidth 
                            variant="contained" 
                            size="large"
                            onClick={() => navigate(`/patient/book/${doctor._id}`)}
                            sx={{ 
                                borderRadius: 3, 
                                py: 2, 
                                fontWeight: 900, 
                                fontSize: "1rem",
                                textTransform: 'none',
                                boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.2)}`
                            }}
                        >
                            Book Consultation
                        </Button>
                    </SectionCard>
                </Grid>

                {/* Detailed Information */}
                <Grid item xs={12} lg={8}>
                    <Stack spacing={4}>
                        <SectionCard title="Professional Narrative" icon={Award}>
                            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.9, fontWeight: 500 }}>
                                {doctor.bio || `Dr. ${doctor.user?.fullName} is a board-certified ${doctor.specialty?.name} with over 15 years of clinical experience. Known for a patient-centric approach and commitment to medical education, they specialize in complex diagnosis and personalized treatment protocols.`}
                            </Typography>

                            <Grid container spacing={2} sx={{ mt: 3 }}>
                                {[
                                    { label: 'Experience', value: `${doctor.experienceYears || '15+'} Years`, icon: Award, color: 'primary' },
                                    { label: 'Followers', value: '2.5k+', icon: Users, color: 'info' },
                                    { label: 'Consultation', value: `$${doctor.fee || '150'}`, icon: DollarSign, color: 'success' },
                                    { label: 'Linguistic', value: 'English, FR', icon: Languages, color: 'warning' }
                                ].map((stat, i) => (
                                    <Grid item xs={6} sm={3} key={i}>
                                        <Paper 
                                            elevation={0} 
                                            sx={{ 
                                                p: 2, 
                                                borderRadius: 3, 
                                                bgcolor: alpha(theme.palette[stat.color].main, 0.04),
                                                border: '1px solid',
                                                borderColor: alpha(theme.palette[stat.color].main, 0.1),
                                                textAlign: 'center'
                                            }}
                                        >
                                            <stat.icon size={18} color={theme.palette[stat.color].main} style={{ marginBottom: 4 }} />
                                            <Typography variant="h6" sx={{ fontWeight: 900, mb: 0.5 }}>{stat.value}</Typography>
                                            <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase' }}>{stat.label}</Typography>
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        </SectionCard>

                        <SectionCard title="Credentials & Academic Root" icon={GraduationCap}>
                            <Stack spacing={2.5}>
                                {(doctor.qualifications || [
                                    "MBBS, MD - Harvard Medical School",
                                    `Fellowship in ${doctor.specialty?.name} - Johns Hopkins Medicine`,
                                    "Board Certified Internal Medicine Specialist"
                                ]).map((q, idx) => (
                                    <Box key={idx} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                        <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: alpha(theme.palette.success.main, 0.1), color: 'success.main' }}>
                                            <CheckCircle2 size={16} />
                                        </Box>
                                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{q}</Typography>
                                    </Box>
                                ))}
                            </Stack>
                        </SectionCard>

                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <SectionCard title="Practice Velocity" icon={Clock}>
                                    <Stack spacing={2}>
                                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
                                            <Box key={day} sx={{ display: "flex", justifyContent: "space-between", alignItems: 'center' }}>
                                                <Typography variant="body2" sx={{ fontWeight: 800 }}>{day}</Typography>
                                                <Typography variant="caption" sx={{ fontWeight: 600, px: 2, py: 0.5, borderRadius: 1, bgcolor: alpha(theme.palette.background.default, 0.8), border: '1px solid', borderColor: 'divider' }}>
                                                    09:00 AM - 05:00 PM
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Stack>
                                </SectionCard>
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <SectionCard title="Quick Booking" icon={CalendarCheck}>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontWeight: 500 }}>
                                        Secure your slot today. We offer same-day emergency consultations for critical concerns.
                                    </Typography>
                                    <Stack spacing={2}>
                                        <Button 
                                            variant="soft" 
                                            fullWidth 
                                            sx={{ borderRadius: 2.5, py: 1.5, fontWeight: 800, textTransform: 'none' }}
                                            onClick={() => navigate(`/patient/book/${doctor._id}`)}
                                        >
                                            View Real-time Availability
                                        </Button>
                                        <Button 
                                            variant="text" 
                                            fullWidth 
                                            startIcon={<Heart size={18} />}
                                            sx={{ fontWeight: 800, textTransform: 'none', color: 'error.main' }}
                                        >
                                            Add to Personal Care Team
                                        </Button>
                                    </Stack>
                                </SectionCard>
                            </Grid>
                        </Grid>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DoctorDetailsPage;
