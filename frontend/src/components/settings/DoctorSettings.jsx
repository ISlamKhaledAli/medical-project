import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
    Box, 
    Typography, 
    TextField, 
    Button, 
    Grid, 
    Alert,
    CircularProgress,
    Stack,
    InputAdornment
} from "@mui/material";
import { 
    Save as SaveIcon,
    MedicalServices as SpecialityIcon,
    Info as BioIcon,
    Payments as FeeIcon,
    WorkHistory as ExpIcon
} from "@mui/icons-material";
import { fetchDoctorById, updateDoctorProfile } from "../../features/doctor/doctorSlice";
import SpecialtySelect from "../doctor/SpecialtySelect";

const DoctorSettings = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { doctorDetails, isLoading, error } = useSelector((state) => state.doctor);
    
    const [formData, setFormData] = useState({
        specialty: "",
        bio: "",
        experience: "",
        consultationFee: ""
    });

    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (user?._id) {
            dispatch(fetchDoctorById(user._id));
        }
    }, [dispatch, user]);

    useEffect(() => {
        if (doctorDetails) {
            setFormData({
                specialty: doctorDetails.specialty?._id || doctorDetails.specialty || "",
                bio: doctorDetails.bio || "",
                experience: doctorDetails.experience || "",
                consultationFee: doctorDetails.consultationFee || ""
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
        const result = await dispatch(updateDoctorProfile(formData));
        if (!result.error) {
            setSuccess(true);
        }
    };

    if (isLoading && !doctorDetails) return <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}><CircularProgress /></Box>;

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 800 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>Professional Profile</Typography>

            {success && (
                <Alert severity="success" sx={{ mb: 3 }}>Doctor profile updated successfully!</Alert>
            )}
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
            )}

            <Stack spacing={4}>
                <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                        <SpecialityIcon color="primary" fontSize="small" /> Medical Specialty
                    </Typography>
                    <SpecialtySelect 
                        value={formData.specialty}
                        onChange={(val) => setFormData(prev => ({ ...prev, specialty: val }))}
                    />
                </Box>

                <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
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
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                            <ExpIcon color="primary" fontSize="small" /> Experience (Years)
                        </Typography>
                        <TextField
                            fullWidth
                            type="number"
                            name="experience"
                            value={formData.experience}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                            <FeeIcon color="primary" fontSize="small" /> Consultation Fee
                        </Typography>
                        <TextField
                            fullWidth
                            type="number"
                            name="consultationFee"
                            value={formData.consultationFee}
                            onChange={handleChange}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                        />
                    </Grid>
                </Grid>

                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button 
                        type="submit" 
                        variant="contained" 
                        startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                        disabled={isLoading}
                        sx={{ px: 4 }}
                    >
                        {isLoading ? "Saving..." : "Save Professional Info"}
                    </Button>
                </Box>
            </Stack>
        </Box>
    );
};

export default DoctorSettings;
