import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    Container,
    Box,
    Stepper,
    Step,
    StepLabel,
    Button,
    Typography,
    TextField,
    MenuItem,
    Grid,
    Alert,
    Stack,
    alpha,
    useTheme,
    Paper,
    InputAdornment,
    Divider
} from "@mui/material";
import {
    User,
    Briefcase,
    CheckCircle2,
    ChevronRight,
    ChevronLeft,
    MapPin,
    DollarSign,
    Award,
    Sparkles,
    FileText,
    Building,
    Check
} from "lucide-react";
import { fetchSpecialties } from "../../features/specialty/specialtySlice";
import {
    createDoctorProfile,
    updateDoctorProfile,
    fetchMyProfile,
} from "../../features/doctor/doctorSlice";
import { toast } from "react-hot-toast";
import GlobalLoader from "../../components/ui/GlobalLoader";
import SectionCard from "../../components/ui/SectionCard";

const steps = ["Clinical Identity", "Professional Context", "Final Verification"];

const DoctorOnboardingPage = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
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
        hospitalName: "",
    });

    const [errors, setErrors] = useState({});
    const [isEditMode, setIsEditMode] = useState(false);

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
                        hospitalName: data.hospitalName || "Central Medical Plaza",
                    });
                }
            })
            .catch(() => setIsEditMode(false));
    }, [dispatch]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
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
            if (!formData.bio) newErrors.bio = "Clinical narrative is required";
            if (formData.bio.length < 50) newErrors.bio = "Narrative is too brief. Provide more detail for patients.";
            if (formData.experienceYears === "" || formData.experienceYears < 0)
                newErrors.experienceYears = "Valid clinical experience required";
            if (!formData.address) newErrors.address = "Clinical address is required";
        } else if (activeStep === 1) {
            if (!formData.specialty) newErrors.specialty = "Medical specialty required";
            if (formData.consultationFee === "" || formData.consultationFee < 1)
                newErrors.consultationFee = "Standardize your consultation fee";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep()) setActiveStep((prev) => prev + 1);
    };

    const handleBack = () => setActiveStep((prev) => prev - 1);

    const handleSubmit = async () => {
        try {
            if (isEditMode) {
                await dispatch(updateDoctorProfile(formData)).unwrap();
                toast.success("Clinical profile synchronized!");
            } else {
                await dispatch(createDoctorProfile(formData)).unwrap();
                toast.success("Welcome to the clinical network!");
            }
            navigate("/doctor/dashboard");
        } catch (err) {
            toast.error(err || "Failed to commit clinical patterns");
        }
    };

    if (isDoctorLoading && !isEditMode && activeStep === 0) return <GlobalLoader message="Initializing onboarding sequence..." />;

    return (
        <Container maxWidth="md" sx={{ py: 6 }}>
            <Box sx={{ textAlign: "center", mb: 8 }}>
                <Box sx={{ 
                    width: 64, height: 64, borderRadius: 3, 
                    bgcolor: alpha(theme.palette.primary.main, 0.1), 
                    color: 'primary.main', display: 'flex', 
                    alignItems: 'center', justifyContent: 'center', 
                    mx: 'auto', mb: 3 
                }}>
                    <Award size={32} />
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 900, color: "text.primary", mb: 1.5 }}>
                    {isEditMode ? "Clinical Credentials" : "Professional Onboarding"}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: 500, mx: "auto", fontWeight: 500 }}>
                    {isEditMode 
                        ? "Update your professional narrative and clinical attributes for patient visibility." 
                        : "Complete your expert profile to join our network of elite medical specialists."}
                </Typography>
            </Box>

            <Stepper 
                activeStep={activeStep} 
                sx={{ 
                    mb: 8,
                    '& .MuiStepIcon-root': { width: 32, height: 32 },
                    '& .MuiStepIcon-root.Mui-active': { color: 'primary.main' },
                    '& .MuiStepIcon-root.Mui-completed': { color: 'success.main' },
                    '& .MuiStepLabel-label': { fontWeight: 800, mt: 1 }
                }}
            >
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            {doctorError && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 4, 
                    borderRadius: "16px",
                    bgcolor: alpha(theme.palette.error.main, 0.08),
                    color: "error.dark",
                    border: "1px solid",
                    borderColor: alpha(theme.palette.error.main, 0.2),
                    fontWeight: 600,
                    py: 1.5,
                    px: 2.5
                  }}
                >
                    {doctorError}
                </Alert>
            )}

            <Box sx={{ mb: 6 }}>
                {activeStep === 0 && (
                    <SectionCard title="Practice Foundations" icon={User}>
                        <Grid container spacing={4}>
                            <Grid size={{ xs: 12 }}>
                                <Stack spacing={1}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 900, color: 'text.secondary' }}>Professional Narrative</Typography>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={5}
                                        name="bio"
                                        placeholder="Share your expertise, clinical philosophy, and academic background..."
                                        value={formData.bio}
                                        onChange={handleChange}
                                        error={!!errors.bio}
                                        helperText={errors.bio || `${formData.bio.length}/500 characters`}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                                    />
                                </Stack>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Stack spacing={1}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 900, color: 'text.secondary' }}>Clinical Tenure (Years)</Typography>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        name="experienceYears"
                                        value={formData.experienceYears}
                                        onChange={handleChange}
                                        error={!!errors.experienceYears}
                                        helperText={errors.experienceYears}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"><Award size={18} /></InputAdornment>,
                                            sx: { borderRadius: 3 }
                                        }}
                                    />
                                </Stack>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Stack spacing={1}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 900, color: 'text.secondary' }}>Primary Hospital</Typography>
                                    <TextField
                                        fullWidth
                                        name="hospitalName"
                                        placeholder="e.g. Mayo Clinic"
                                        value={formData.hospitalName}
                                        onChange={handleChange}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"><Building size={18} /></InputAdornment>,
                                            sx: { borderRadius: 3 }
                                        }}
                                    />
                                </Stack>
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <Stack spacing={1}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 900, color: 'text.secondary' }}>Clinical Site Address</Typography>
                                    <TextField
                                        fullWidth
                                        name="address"
                                        placeholder="Enter the full medical facility address..."
                                        value={formData.address}
                                        onChange={handleChange}
                                        error={!!errors.address}
                                        helperText={errors.address}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"><MapPin size={18} /></InputAdornment>,
                                            sx: { borderRadius: 3 }
                                        }}
                                    />
                                </Stack>
                            </Grid>
                        </Grid>
                    </SectionCard>
                )}

                {activeStep === 1 && (
                    <SectionCard title="Medical Domain" icon={Briefcase}>
                        <Grid container spacing={4}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Stack spacing={1}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 900, color: 'text.secondary' }}>Clinical Specialty</Typography>
                                    <TextField
                                        select
                                        fullWidth
                                        name="specialty"
                                        value={formData.specialty}
                                        onChange={handleChange}
                                        error={!!errors.specialty}
                                        helperText={errors.specialty}
                                        InputProps={{ sx: { borderRadius: 3 } }}
                                    >
                                        {specialties.map((s) => (
                                            <MenuItem key={s._id} value={s._id} sx={{ fontWeight: 700 }}>{s.name}</MenuItem>
                                        ))}
                                    </TextField>
                                </Stack>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Stack spacing={1}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 900, color: 'text.secondary' }}>Standard Consultation Fee</Typography>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        name="consultationFee"
                                        value={formData.consultationFee}
                                        onChange={handleChange}
                                        error={!!errors.consultationFee}
                                        helperText={errors.consultationFee}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"><DollarSign size={18} /></InputAdornment>,
                                            sx: { borderRadius: 3 }
                                        }}
                                    />
                                </Stack>
                            </Grid>
                        </Grid>
                    </SectionCard>
                )}

                {activeStep === 2 && (
                    <SectionCard title="Regulatory Verification" icon={FileText}>
                        <Alert 
                          severity="success" 
                          icon={<Sparkles size={22} />} 
                          sx={{ 
                            mb: 4, 
                            borderRadius: "16px", 
                            bgcolor: alpha(theme.palette.success.main, 0.08), 
                            color: 'success.dark', 
                            border: '1px solid', 
                            borderColor: alpha(theme.palette.success.main, 0.2),
                            py: 2,
                            px: 3,
                            fontWeight: 600,
                            "& .MuiAlert-icon": { display: 'flex', alignItems: 'center' }
                          }}
                        >
                            <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>Validation Successful</Typography>
                            <Typography variant="caption" sx={{ fontWeight: 600 }}>Your clinical attributes are verified and ready for publication.</Typography>
                        </Alert>
                        
                        <Stack spacing={4}>
                            <Box sx={{ p: 4, borderRadius: 4, bgcolor: alpha(theme.palette.primary.main, 0.02), border: '1px dashed', borderColor: alpha(theme.palette.primary.main, 0.1) }}>
                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 900, textTransform: "uppercase", letterSpacing: 1 }}>Professional Narrative</Typography>
                                <Typography variant="body1" sx={{ mt: 1, fontWeight: 500, lineHeight: 1.8 }}>{formData.bio}</Typography>
                            </Box>

                            <Grid container spacing={3}>
                                {[
                                    { icon: Award, label: 'Clinical Domain', value: specialties.find(s => s._id === formData.specialty)?.name || "N/A" },
                                    { icon: Sparkles, label: 'Tenure', value: `${formData.experienceYears} Years` },
                                    { icon: DollarSign, label: 'Standard Rate', value: `$${formData.consultationFee}` },
                                    { icon: MapPin, label: 'Active Facility', value: formData.hospitalName || "N/A" }
                                ].map((stat, i) => (
                                    <Grid size={6} key={i}>
                                        <Paper elevation={0} sx={{ p: 3, borderRadius: 4, bgcolor: 'white', border: '1px solid', borderColor: 'divider' }}>
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: alpha(theme.palette.primary.main, 0.05), color: 'primary.main' }}>
                                                    <stat.icon size={18} />
                                                </Box>
                                                <Box>
                                                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, display: 'block' }}>{stat.label}</Typography>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>{stat.value}</Typography>
                                                </Box>
                                            </Stack>
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        </Stack>
                    </SectionCard>
                )}
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Button
                    variant="soft"
                    onClick={handleBack}
                    disabled={activeStep === 0 || isDoctorLoading}
                    startIcon={<ChevronLeft size={20} />}
                    sx={{ borderRadius: 3, px: 4, py: 1.5, fontWeight: 900 }}
                >
                    Previous Sequence
                </Button>
                
                <Box>
                    {activeStep < 2 ? (
                        <Button
                            variant="contained"
                            onClick={handleNext}
                            disabled={isDoctorLoading}
                            endIcon={<ChevronRight size={20} />}
                            sx={{ borderRadius: 3, px: 5, py: 1.5, fontWeight: 900, boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.25)}` }}
                        >
                            Next Milestone
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            color="success"
                            onClick={handleSubmit}
                            disabled={isDoctorLoading}
                            startIcon={isDoctorLoading ? null : <Check size={20} />}
                            sx={{ borderRadius: 3, px: 5, py: 1.5, fontWeight: 900, boxShadow: `0 8px 24px ${alpha(theme.palette.success.main, 0.25)}` }}
                        >
                            {isDoctorLoading ? "Commiting..." : isEditMode ? "Synchronize" : "Finalize Setup"}
                        </Button>
                    )}
                </Box>
            </Box>
        </Container>
    );
};

export default DoctorOnboardingPage;
