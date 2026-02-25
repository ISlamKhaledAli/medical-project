import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    Container,
    Paper,
    Box,
    Stepper,
    Step,
    StepLabel,
    Button,
    Typography,
    TextField,
    MenuItem,
    Grid,
    CircularProgress,
    Alert,
    Divider,
    Stack,
    IconButton,
} from "@mui/material";
import {
    Person as PersonIcon,
    Work as WorkIcon,
    Visibility as ReviewIcon,
    ArrowBack as BackIcon,
    CheckCircle as SuccessIcon,
} from "@mui/icons-material";
import { fetchSpecialties } from "../../features/specialty/specialtySlice";
import {
    createDoctorProfile,
    updateDoctorProfile,
    fetchMyProfile,
} from "../../features/doctor/doctorSlice";
import { toast } from "react-hot-toast";

const steps = ["Personal Info", "Professional Info", "Review & Submit"];

const DoctorOnboardingPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.auth);
    const { doctorDetails, isLoading: isDoctorLoading, error: doctorError } = useSelector((state) => state.doctor);
    const { specialties, loading: isSpecialtiesLoading } = useSelector((state) => state.specialty);

    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
        bio: "",
        experienceYears: "",
        address: "",
        specialty: "",
        consultationFee: "",
    });

    const [errors, setErrors] = useState({});
    const [isEditMode, setIsEditMode] = useState(false);

    // Initial load: Fetch profile and specialties
    useEffect(() => {
        dispatch(fetchSpecialties());
        dispatch(fetchMyProfile())
            .unwrap()
            .then((data) => {
                if (data) {
                    setIsEditMode(true);
                    setFormData({
                        bio: data.bio || "",
                        experienceYears: data.experienceYears || "",
                        address: data.address || "",
                        specialty: data.specialty?._id || data.specialty || "",
                        consultationFee: data.consultationFee || "",
                    });
                }
            })
            .catch(() => {
                // No profile found, stay in setup mode
                setIsEditMode(false);
            });
    }, [dispatch]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validateStep = () => {
        const newErrors = {};
        if (activeStep === 0) {
            if (!formData.bio) newErrors.bio = "Bio is required";
            if (formData.bio.length > 500) newErrors.bio = "Bio cannot exceed 500 characters";
            if (formData.experienceYears === "" || formData.experienceYears < 0)
                newErrors.experienceYears = "Valid experience is required";
            if (!formData.address) newErrors.address = "Address is required";
        } else if (activeStep === 1) {
            if (!formData.specialty) newErrors.specialty = "Specialty is required";
            if (formData.consultationFee === "" || formData.consultationFee < 1)
                newErrors.consultationFee = "Fee must be at least 1";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep()) {
            setActiveStep((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    const handleSubmit = async () => {
        try {
            if (isEditMode) {
                await dispatch(updateDoctorProfile(formData)).unwrap();
                toast.success("Profile updated!");
            } else {
                await dispatch(createDoctorProfile(formData)).unwrap();
                toast.success("Profile setup complete!");
            }
            navigate("/doctor/dashboard");
        } catch (err) {
            toast.error(err || "Action failed");
        }
    };

    const isNextDisabled = () => {
        if (activeStep === 0) {
            return !formData.bio || !formData.address || formData.experienceYears === "";
        }
        if (activeStep === 1) {
            return !formData.specialty || !formData.consultationFee;
        }
        return false;
    };

    if (isDoctorLoading && activeStep === 0 && !isEditMode) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, border: "1px solid", borderColor: "divider" }}>
                <Box sx={{ textAlign: "center", mb: 4 }}>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: "primary.main", mb: 1 }}>
                        {isEditMode ? "Edit Professional Profile" : "Doctor Onboarding"}
                    </Typography>
                    <Typography color="text.secondary">
                        {isEditMode 
                            ? "Keep your professional information up to date for patients." 
                            : "Complete your profile to start receiving appointment requests."}
                    </Typography>
                </Box>

                <Stepper activeStep={activeStep} sx={{ mb: 5 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                {doctorError && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {doctorError}
                    </Alert>
                )}

                <Box sx={{ mt: 2 }}>
                    {/* STEP 1: PERSONAL INFO */}
                    {activeStep === 0 && (
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                        Professional Bio
                                    </Typography>
                                    <Typography variant="caption" color={formData.bio.length > 500 ? "error" : "text.secondary"}>
                                        {formData.bio.length}/500
                                    </Typography>
                                </Box>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    name="bio"
                                    placeholder="Tell patients about your expertise, background, and approach to care..."
                                    value={formData.bio}
                                    onChange={handleChange}
                                    error={!!errors.bio}
                                    helperText={errors.bio}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                                    Years of Experience
                                </Typography>
                                <TextField
                                    fullWidth
                                    type="number"
                                    name="experienceYears"
                                    value={formData.experienceYears}
                                    onChange={handleChange}
                                    error={!!errors.experienceYears}
                                    helperText={errors.experienceYears}
                                    inputProps={{ min: 0 }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                                    Clinic/Office Address
                                </Typography>
                                <TextField
                                    fullWidth
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    error={!!errors.address}
                                    helperText={errors.address}
                                />
                            </Grid>
                        </Grid>
                    )}

                    {/* STEP 2: PROFESSIONAL INFO */}
                    {activeStep === 1 && (
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                                    Specialty
                                </Typography>
                                <TextField
                                    select
                                    fullWidth
                                    name="specialty"
                                    value={formData.specialty}
                                    onChange={handleChange}
                                    error={!!errors.specialty}
                                    helperText={errors.specialty}
                                    disabled={isSpecialtiesLoading}
                                >
                                    {specialties.map((s) => (
                                        <MenuItem key={s._id} value={s._id}>
                                            {s.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                                    Consultation Fee ($)
                                </Typography>
                                <TextField
                                    fullWidth
                                    type="number"
                                    name="consultationFee"
                                    value={formData.consultationFee}
                                    onChange={handleChange}
                                    error={!!errors.consultationFee}
                                    helperText={errors.consultationFee}
                                    inputProps={{ min: 1 }}
                                />
                            </Grid>
                        </Grid>
                    )}

                    {/* STEP 3: REVIEW */}
                    {activeStep === 2 && (
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, display: "flex", alignItems: "center" }}>
                                <ReviewIcon sx={{ mr: 1 }} /> Review Your Information
                            </Typography>
                            
                            <Stack spacing={2}>
                                <Box sx={{ p: 2, bgcolor: "rgba(0,0,0,0.02)", borderRadius: 2 }}>
                                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: "uppercase" }}>
                                        Bio
                                    </Typography>
                                    <Typography variant="body2">{formData.bio}</Typography>
                                </Box>

                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Box sx={{ p: 2, bgcolor: "rgba(0,0,0,0.02)", borderRadius: 2 }}>
                                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: "uppercase" }}>
                                                Specialty
                                            </Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 700 }}>
                                                {specialties.find(s => s._id === formData.specialty)?.name || "Not selected"}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Box sx={{ p: 2, bgcolor: "rgba(0,0,0,0.02)", borderRadius: 2 }}>
                                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: "uppercase" }}>
                                                Experience
                                            </Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 700 }}>
                                                {formData.experienceYears} Years
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Box sx={{ p: 2, bgcolor: "rgba(0,0,0,0.02)", borderRadius: 2 }}>
                                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: "uppercase" }}>
                                                Consultation Fee
                                            </Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 700, color: "primary.main" }}>
                                                ${formData.consultationFee}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Box sx={{ p: 2, bgcolor: "rgba(0,0,0,0.02)", borderRadius: 2 }}>
                                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: "uppercase" }}>
                                                Clinic Location
                                            </Typography>
                                            <Typography variant="body1">{formData.address}</Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Stack>
                        </Box>
                    )}
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 5, pt: 2, borderTop: "1px solid", borderColor: "divider" }}>
                    <Button
                        variant="outlined"
                        onClick={handleBack}
                        disabled={activeStep === 0 || isDoctorLoading}
                        startIcon={<BackIcon />}
                        sx={{ borderRadius: 2, px: 3, fontWeight: 700 }}
                    >
                        Back
                    </Button>
                    
                    <Box>
                        {activeStep < 2 ? (
                            <Button
                                variant="contained"
                                onClick={handleNext}
                                disabled={isNextDisabled()}
                                sx={{ borderRadius: 2, px: 4, fontWeight: 700 }}
                            >
                                Next Step
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                color="success"
                                onClick={handleSubmit}
                                disabled={isDoctorLoading}
                                startIcon={isDoctorLoading ? <CircularProgress size={20} color="inherit" /> : <SuccessIcon />}
                                sx={{ borderRadius: 2, px: 4, fontWeight: 700 }}
                            >
                                {isEditMode ? "Save Changes" : "Complete Setup"}
                            </Button>
                        )}
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default DoctorOnboardingPage;
