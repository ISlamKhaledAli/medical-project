import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
    Container, 
    Grid, 
    Box, 
    Typography, 
    Avatar, 
    Button, 
    Paper, 
    Chip, 
    Rating, 
    Divider,
    IconButton,
    CircularProgress
} from "@mui/material";
import { 
    ArrowBack as BackIcon, 
    LocationOn as LocationIcon, 
    LocalHospital as HospitalIcon,
    School as EducationIcon,
    Language as LanguageIcon,
    AccessTime as TimeIcon
} from "@mui/icons-material";
import { fetchDoctorById, clearDoctorDetails } from "../../features/doctor/doctorSlice";

const DoctorDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { doctorDetails: doctor, isLoading, error } = useSelector((state) => state.doctor);

    useEffect(() => {
        dispatch(fetchDoctorById(id));
        return () => dispatch(clearDoctorDetails());
    }, [dispatch, id]);

    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !doctor) {
        return (
            <Container sx={{ py: 10, textAlign: "center" }}>
                <Typography color="error" variant="h5" sx={{ mb: 2 }}>
                    {error || "Doctor not found"}
                </Typography>
                <Button variant="contained" onClick={() => navigate("/doctors")}>Back to List</Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Button 
                startIcon={<BackIcon />} 
                onClick={() => navigate(-1)}
                sx={{ mb: 4, textTransform: "none", fontWeight: 700, color: "text.secondary" }}
            >
                Back
            </Button>

            <Grid container spacing={4}>
                {/* Left Side: Profile Card */}
                <Grid item xs={12} md={4}>
                    <Paper 
                        elevation={0} 
                        sx={{ 
                            p: 4, 
                            borderRadius: 4, 
                            textAlign: "center",
                            border: "1px solid rgba(0,0,0,0.05)",
                            position: "sticky",
                            top: 100
                        }}
                    >
                        <Avatar 
                            src={doctor.image} 
                            sx={{ width: 150, height: 150, mx: "auto", mb: 3, border: "5px solid white", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} 
                        />
                        <Typography variant="h5" sx={{ fontWeight: 900, color: "#1a237e", mb: 1 }}>
                            {doctor.name}
                        </Typography>
                        <Chip 
                            label={doctor.specialty} 
                            color="primary" 
                            size="small"
                            sx={{ fontWeight: 700, mb: 3 }} 
                        />
                        
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mb: 3 }}>
                            <Rating value={doctor.rating || 4.8} readOnly precision={0.5} />
                            <Typography variant="body2" sx={{ ml: 1, fontWeight: 700 }}>
                                {doctor.rating || 4.8}
                            </Typography>
                        </Box>

                        <Divider sx={{ mb: 3 }} />

                        <Box sx={{ textAlign: "left", mb: 4 }}>
                            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                <LocationIcon sx={{ color: "primary.main", mr: 2, fontSize: "1.2rem" }} />
                                <Typography variant="body2">{doctor.address || "Medical Plaza, NYC"}</Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                <HospitalIcon sx={{ color: "primary.main", mr: 2, fontSize: "1.2rem" }} />
                                <Typography variant="body2">{doctor.hospital || "Central Hope Hospital"}</Typography>
                            </Box>
                        </Box>

                        <Button 
                            fullWidth 
                            variant="contained" 
                            size="large"
                            onClick={() => navigate(`/book/${doctor.id}`)}
                            sx={{ borderRadius: 3, py: 1.5, fontWeight: 800, fontSize: "1rem" }}
                        >
                            Book Appointment
                        </Button>
                    </Paper>
                </Grid>

                {/* Right Side: Details & Tabs */}
                <Grid item xs={12} md={8}>
                    <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: "1px solid rgba(0,0,0,0.05)", mb: 4 }}>
                        <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>About Doctor</Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: 4 }}>
                            {doctor.bio || "Dr. " + doctor.name + " is a distinguished specialist with a focus on clinical excellence and patient care. Over the past 15 years, they have pioneered various treatment protocols and maintained a consistent record of successful outcomes."}
                        </Typography>

                        <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>Qualifications</Typography>
                        <Box sx={{ mb: 4 }}>
                            {doctor.qualifications?.map((q, idx) => (
                                <Box key={idx} sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                                    <EducationIcon sx={{ color: "primary.main", mr: 2, fontSize: "1.2rem" }} />
                                    <Typography variant="body2">{q}</Typography>
                                </Box>
                            )) || (
                                <>
                                    <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                                        <EducationIcon sx={{ color: "primary.main", mr: 2, fontSize: "1.2rem" }} />
                                        <Typography variant="body2">MBBS, MD - Harvard Medical School</Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                                        <EducationIcon sx={{ color: "primary.main", mr: 2, fontSize: "1.2rem" }} />
                                        <Typography variant="body2">Fellowship in {doctor.specialty} - Johns Hopkins</Typography>
                                    </Box>
                                </>
                            )}
                        </Box>

                        <Divider sx={{ mb: 4 }} />

                        <Grid container spacing={3}>
                            <Grid item xs={6} sm={3}>
                                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>Experience</Typography>
                                <Typography variant="body1" sx={{ fontWeight: 700 }}>15+ Years</Typography>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>Patients</Typography>
                                <Typography variant="body1" sx={{ fontWeight: 700 }}>2,500+</Typography>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>Language</Typography>
                                <Typography variant="body1" sx={{ fontWeight: 700 }}>English, Spanish</Typography>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>Fee</Typography>
                                <Typography variant="body1" sx={{ fontWeight: 700, color: "success.main" }}>$150.00</Typography>
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Schedule Snippet */}
                    <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: "1px solid rgba(0,0,0,0.05)" }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 800 }}>Clinic Hours</Typography>
                            <Box sx={{ display: "flex", alignItems: "center", color: "success.main" }}>
                                <TimeIcon sx={{ fontSize: "1rem", mr: 0.5 }} />
                                <Typography variant="caption" sx={{ fontWeight: 700 }}>Available Today</Typography>
                            </Box>
                        </Box>
                        
                        <Grid container spacing={2}>
                            {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => (
                                <Grid item xs={12} key={day} sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{day}</Typography>
                                    <Typography variant="body2" color="text.secondary">09:00 AM - 05:00 PM</Typography>
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default DoctorDetailsPage;
