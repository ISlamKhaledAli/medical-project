import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
    Container, 
    Grid, 
    Typography, 
    Box, 
    Card, 
    CardContent, 
    Avatar, 
    Button,
    Rating
} from "@mui/material";
import { fetchDoctors } from "../../features/doctor/doctorSlice";
import DoctorCardSkeleton from "../../components/skeletons/DoctorCardSkeleton";

const DoctorListPage = () => {
    const dispatch = useDispatch();
    const { doctors, isLoading, error } = useSelector((state) => state.doctor);

    useEffect(() => {
        dispatch(fetchDoctors());
    }, [dispatch]);

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Box sx={{ mb: 6, textAlign: "center" }}>
                <Typography variant="h3" sx={{ fontWeight: 800, color: "#1a237e", mb: 2 }}>
                    Our Medical Specialists
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: "auto" }}>
                    Find the best doctors and specialists for your medical needs. All our professionals are highly qualified and verified.
                </Typography>
            </Box>

            {error && (
                <Box sx={{ mb: 4, textAlign: "center" }}>
                    <Typography color="error" variant="h6">{error}</Typography>
                    <Button onClick={() => dispatch(fetchDoctors())} sx={{ mt: 1 }}>Try Again</Button>
                </Box>
            )}

            <Grid container spacing={4}>
                {isLoading ? (
                    // Render 6 skeletons while loading
                    [...Array(6)].map((_, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <DoctorCardSkeleton />
                        </Grid>
                    ))
                ) : (
                    doctors.map((doctor) => (
                        <Grid item xs={12} sm={6} md={4} key={doctor.id}>
                            <Card sx={{ height: "100%", borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.05)", transition: "0.3s", "&:hover": { transform: "translateY(-5px)", boxShadow: "0 8px 24px rgba(0,0,0,0.1)" } }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                        <Avatar 
                                            src={doctor.image} 
                                            sx={{ width: 64, height: 64, mr: 2, border: "2px solid #e3f2fd" }} 
                                        />
                                        <Box>
                                            <Typography variant="h6" sx={{ fontWeight: 700 }}>{doctor.name}</Typography>
                                            <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>{doctor.specialty}</Typography>
                                        </Box>
                                    </Box>
                                    <Rating value={doctor.rating || 4.5} readOnly size="small" sx={{ mb: 1 }} />
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                        {doctor.bio || "No biography provided. Specialist in various medical treatments and patient care."}
                                    </Typography>
                                    <Button 
                                        fullWidth 
                                        variant="contained" 
                                        sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700 }}
                                    >
                                        Book Appointment
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                )}
            </Grid>
        </Container>
    );
};

export default DoctorListPage;
