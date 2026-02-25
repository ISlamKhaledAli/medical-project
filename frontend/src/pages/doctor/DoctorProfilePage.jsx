import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
    Box, 
    Typography, 
    Paper, 
    Grid, 
    TextField, 
    Button, 
    MenuItem, 
    Avatar,
    Divider,
    Alert,
    CircularProgress,
    Card,
    CardContent,
    Chip,
    Stack
} from "@mui/material";
import { 
    Person as ProfileIcon, 
    Save as SaveIcon,
    MedicalServices as SpecialityIcon,
    Info as BioIcon,
    Payments as FeeIcon,
    WorkHistory as ExpIcon
} from "@mui/icons-material";
import { fetchMyProfile, createDoctorProfile, updateDoctorProfile } from "../../features/doctor/doctorSlice";
import SpecialtySelect from "../../components/doctor/SpecialtySelect";

const DoctorProfilePage = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { doctorDetails, isLoading, error } = useSelector((state) => state.doctor);
    
    const [formData, setFormData] = useState({
        specialty: "",
        bio: "",
        experienceYears: "",
        consultationFee: "",
        address: ""
    });

    const [success, setSuccess] = useState(false);

    useEffect(() => {
        dispatch(fetchMyProfile());
    }, [dispatch]);

    useEffect(() => {
        if (doctorDetails) {
            setFormData({
                specialty: doctorDetails.specialty?._id || doctorDetails.specialty || "",
                bio: doctorDetails.bio || "",
                experienceYears: doctorDetails.experienceYears || "",
                consultationFee: doctorDetails.consultationFee || "",
                address: doctorDetails.address || ""
            });
        }
    }, [doctorDetails]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setSuccess(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        let result;
        if (doctorDetails) {
            result = await dispatch(updateDoctorProfile(formData));
        } else {
            result = await dispatch(createDoctorProfile(formData));
        }

        if (!result.error) {
            setSuccess(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    if (isLoading && !doctorDetails) return <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}><CircularProgress /></Box>;

    return (
        <Box sx={{ p: 4, maxWidth: 1000, mx: "auto" }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: "#1a237e" }}>
                    Doctor Profile Management
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Manage your professional information and consultation details.
                </Typography>
            </Box>

            {success && (
                <Alert severity="success" sx={{ mb: 4, borderRadius: 2 }}>
                    Profile updated successfully!
                </Alert>
            )}

            {user?.status === "pending" && (
                <Alert severity="warning" sx={{ mb: 4, borderRadius: 2 }}>
                    <strong>Account Pending Approval:</strong> Your profile is currently being reviewed by administrators. You will be able to manage availability once approved.
                </Alert>
            )}

            {user?.status === "rejected" && (
                <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
                    <strong>Account Rejected:</strong> Your application has been rejected. Please contact support if you believe this is an error.
                </Alert>
            )}

            {error && error !== "Doctor profile not found." && (
                <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
                    {error}
                </Alert>
            )}

            <form onSubmit={handleSubmit}>
                <Grid container spacing={4}>
                    {/* Public Info */}
                    <Grid item xs={12} md={4}>
                        <Card sx={{ borderRadius: 4, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
                            <CardContent sx={{ textAlign: "center", py: 5 }}>
                                <Avatar 
                                    sx={{ 
                                        width: 120, 
                                        height: 120, 
                                        mx: "auto", 
                                        mb: 3, 
                                        bgcolor: "primary.main",
                                        fontSize: "3rem"
                                    }}
                                >
                                    {user?.fullName?.[0]}
                                </Avatar>
                                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                    Dr. {user?.fullName}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    {user?.email}
                                </Typography>
                                <Chip label="Verified Account" color="success" size="small" variant="outlined" />
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Form Fields */}
                    <Grid item xs={12} md={8}>
                        <Paper sx={{ p: 4, borderRadius: 4, border: "1px solid rgba(0,0,0,0.05)" }}>
                            <Stack spacing={4}>
                                <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
                                        <SpecialityIcon color="primary" fontSize="small" /> Medical Specialty
                                    </Typography>
                                    <SpecialtySelect 
                                        value={formData.specialty}
                                        onChange={(val) => setFormData(prev => ({ ...prev, specialty: val }))}
                                    />
                                </Box>

                                <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
                                        <BioIcon color="primary" fontSize="small" /> Professional Bio
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={4}
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        placeholder="Describe your background, expertise, and patient approach..."
                                    />
                                </Box>

                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
                                            <ExpIcon color="primary" fontSize="small" /> Experience (Years)
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            type="number"
                                            name="experienceYears"
                                            value={formData.experienceYears}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
                                            <FeeIcon color="primary" fontSize="small" /> Consultation Fee ($)
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            type="number"
                                            name="consultationFee"
                                            value={formData.consultationFee}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                </Grid>

                                <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5 }}>
                                        Clinic Address
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                    />
                                </Box>

                                <Divider />

                                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                                    <Button 
                                        type="submit" 
                                        variant="contained" 
                                        startIcon={<SaveIcon />}
                                        disabled={isLoading}
                                        sx={{ borderRadius: 3, px: 4, py: 1.5, fontWeight: 700 }}
                                    >
                                        {isLoading ? "Saving..." : "Save Changes"}
                                    </Button>
                                </Box>
                            </Stack>
                        </Paper>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
};

export default DoctorProfilePage;
