import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Radio,
  Alert,
  IconButton,
  InputAdornment,
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
  Tooltip,
  CircularProgress,
  Link,
  Fade,
  Stack,
  alpha,
  useTheme,
  Paper,
  Divider
} from "@mui/material";
import {
  User as PersonIcon,
  Stethoscope as DoctorIcon,
  ChevronLeft as BackIcon,
  Eye as EyeIcon,
  EyeOff as EyeOffIcon,
  Info as InfoIcon,
  CheckCircle2 as SuccessIcon,
  PlusSquare as PlusIcon,
  ShieldCheck,
  Calendar
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { 
  validateEmail, 
  validatePassword, 
  validateName, 
  normalizeEmail, 
  getStrengthLabel, 
  getStrengthColor 
} from "../../utils/validators";

const steps = ["Basic Info", "Role Selection", "Final Review"];

const RegisterPage = () => {
  const { 
    isRegisterLoading, 
    error, 
    successMessage, 
    register: registerUser, 
    clearAuthError,
    isAuthenticated,
    userRole
  } = useAuth();
  
  const navigate = useNavigate();
  const theme = useTheme();

  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "patient",
  });

  const [formErrors, setFormErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const passwordStrength = useMemo(() => {
    if (!formData.password) return 0;
    return validatePassword(formData.password).strength;
  }, [formData.password]);

  useEffect(() => {
    clearAuthError();
  }, [clearAuthError, activeStep]);

  useEffect(() => {
    if (isAuthenticated) {
      const target = userRole === "admin" ? "/admin" : userRole === "doctor" ? "/doctor/dashboard" : "/patient";
      navigate(target);
    }
  }, [isAuthenticated, userRole, navigate]);

  const validateField = useCallback((name, value) => {
    switch (name) {
      case "fullName":
        return validateName(value);
      case "email":
        return validateEmail(value);
      case "password":
        return validatePassword(value).error;
      case "confirmPassword":
        if (!value) return "Please confirm your password";
        if (value !== formData.password) return "Passwords do not match";
        return null;
      default:
        return null;
    }
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }

    if (name === "password" && touched.confirmPassword) {
        setFormErrors(prev => ({ 
            ...prev, 
            confirmPassword: value !== formData.confirmPassword ? "Passwords do not match" : null 
        }));
    }

    if (error) clearAuthError();
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setFormErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleNext = () => {
    if (activeStep === 0) {
      const nameError = validateField("fullName", formData.fullName);
      const emailError = validateField("email", formData.email);
      const passwordError = validateField("password", formData.password);
      const confirmError = validateField("confirmPassword", formData.confirmPassword);

      if (nameError || emailError || passwordError || confirmError) {
        setFormErrors({ fullName: nameError, email: emailError, password: passwordError, confirmPassword: confirmError });
        setTouched({ fullName: true, email: true, password: true, confirmPassword: true });
        return;
      }
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    await registerUser({
      ...formData,
      fullName: formData.fullName.trim(),
      email: normalizeEmail(formData.email)
    });
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack gap={3}>
            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 700, ml: 0.5 }}>Full Name</Typography>
              <TextField
                fullWidth
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.fullName && !!formErrors.fullName}
                helperText={touched.fullName && formErrors.fullName}
                required
              />
            </Box>
            
            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 700, ml: 0.5 }}>Email Address</Typography>
              <TextField
                fullWidth
                name="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && !!formErrors.email}
                helperText={touched.email && formErrors.email}
                required
                autoComplete="email"
              />
            </Box>

            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 700, ml: 0.5, display: "flex", alignItems: "center" }}>
                  Password 
                  <Tooltip title="At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char" arrow>
                      <IconButton size="small" sx={{ ml: 0.5 }}><InfoIcon size={14} /></IconButton>
                  </Tooltip>
              </Typography>
              <TextField
                fullWidth
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && !!formErrors.password}
                helperText={touched.password && formErrors.password}
                required
                autoComplete="new-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" type="button">
                        {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {formData.password && (
                  <Box sx={{ mt: 1.5, px: 0.5 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                          <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary" }}>
                            Strength: {getStrengthLabel(passwordStrength)}
                          </Typography>
                      </Box>
                      <LinearProgress 
                          variant="determinate" 
                          value={(passwordStrength / 5) * 100} 
                          color={getStrengthColor(passwordStrength)} 
                          sx={{ height: 6, borderRadius: 3, bgcolor: "rgba(0,0,0,0.05)" }} 
                      />
                  </Box>
              )}
            </Box>

            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 700, ml: 0.5 }}>Confirm Password</Typography>
              <TextField
                fullWidth
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.confirmPassword && !!formErrors.confirmPassword}
                helperText={touched.confirmPassword && formErrors.confirmPassword}
                required
                autoComplete="new-password"
              />
            </Box>
          </Stack>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 900, mb: 1, color: "text.primary" }}>
              Select Your Role
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4, fontWeight: 500 }}>
              Are you registering as a professional Doctor or a Patient?
            </Typography>

            <Stack gap={2.5}>
              {[
                { id: "patient", icon: PersonIcon, label: "I am a Patient", desc: "Book appointments, view medical records and chat with doctors." },
                { id: "doctor", icon: DoctorIcon, label: "I am a Doctor", desc: "Manage your schedule, approvals and patient consultations." }
              ].map((role) => (
                <Paper
                  key={role.id}
                  onClick={() => setFormData((prev) => ({ ...prev, role: role.id }))}
                  elevation={0}
                  sx={{
                    p: 3,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                    borderRadius: 4,
                    border: "2px solid",
                    borderColor: formData.role === role.id ? "primary.main" : "divider",
                    bgcolor: formData.role === role.id ? alpha(theme.palette.primary.main, 0.04) : "transparent",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      borderColor: formData.role === role.id ? "primary.main" : alpha(theme.palette.primary.main, 0.3),
                      bgcolor: formData.role === role.id ? alpha(theme.palette.primary.main, 0.04) : alpha(theme.palette.primary.main, 0.01)
                    }
                  }}
                >
                  <Box sx={{ 
                    p: 1.5, 
                    borderRadius: 3, 
                    bgcolor: formData.role === role.id ? "primary.main" : alpha(theme.palette.text.disabled, 0.1),
                    color: formData.role === role.id ? "white" : "text.secondary",
                    transition: "all 0.2s ease"
                  }}>
                    <role.icon size={28} />
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>{role.label}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>{role.desc}</Typography>
                  </Box>
                  <Radio checked={formData.role === role.id} color="primary" />
                </Paper>
              ))}
            </Stack>
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 900, mb: 3, color: "text.primary" }}>Review & Complete</Typography>
            <Stack gap={2} sx={{ mb: 4 }}>
                <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, bgcolor: "background.default", border: "1px solid", borderColor: "divider" }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Full Name</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 800, mt: 0.5 }}>{formData.fullName}</Typography>
                </Paper>
                <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, bgcolor: "background.default", border: "1px solid", borderColor: "divider" }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Email Address</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 800, mt: 0.5 }}>{formData.email}</Typography>
                </Paper>
                <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, bgcolor: "background.default", border: "1px solid", borderColor: "divider" }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Account Type</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 800, mt: 0.5, textTransform: "capitalize" }}>{formData.role}</Typography>
                </Paper>
            </Stack>
            <Alert 
              severity="info" 
              icon={<SuccessIcon size={22} style={{ color: theme.palette.info.main }} />}
              sx={{ 
                borderRadius: "16px", 
                fontWeight: 600, 
                bgcolor: alpha(theme.palette.info.main, 0.08),
                color: "info.dark", // High contrast
                border: "1px solid",
                borderColor: alpha(theme.palette.info.main, 0.2),
                py: 2,
                px: 3,
                "& .MuiAlert-icon": {
                  display: 'flex',
                  alignItems: 'center',
                  opacity: 1
                },
                "& .MuiAlert-message": {
                  fontSize: "0.95rem",
                  letterSpacing: "0.01em"
                }
              }}
            >
              Almost there! Click the button below to finalize your registration.
            </Alert>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", bgcolor: "#fff" }}>
      <Grid container sx={{ flexGrow: 1 }}>
        {/* Left Column: Branding & Illustration (Shared with Login) */}
        <Grid size={{ xs: 12, md: 5, lg: 6 }} sx={{ 
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          bgcolor: alpha(theme.palette.primary.main, 0.03),
          p: 8,
          position: "relative",
          overflow: "hidden"
        }}>
          {/* Logo */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 8 }}>
            <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: "primary.main", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <PlusIcon color="white" size={28} strokeWidth={3} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 900, color: "text.primary" }}>MEDIC TOTAL</Typography>
          </Box>

          <Box sx={{ position: "relative", zIndex: 1, mt: "auto", mb: "auto" }}>
            <Typography variant="h3" sx={{ fontWeight: 900, mb: 3, maxWidth: 500, lineHeight: 1.2 }}>
              Join the Future of <Box component="span" sx={{ color: "primary.main" }}>Healthcare</Box>
            </Typography>
            
            <Stack gap={4} sx={{ mt: 5 }}>
              {[
                { icon: DoctorIcon, title: "For Doctors", desc: "Build your reputation and manage your clinical practice with ease." },
                { icon: Calendar, title: "For Patients", desc: "Find the best doctors and book appointments in seconds." }
              ].map((f, i) => (
                <Box key={i} sx={{ display: "flex", gap: 2.5 }}>
                  <Box sx={{ p: 1.5, borderRadius: 2.5, bgcolor: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.03)", color: "primary.main", height: "fit-content" }}>
                    <f.icon size={28} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>{f.title}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>{f.desc}</Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>

          <Box sx={{ position: "absolute", bottom: -100, left: -100, width: 300, height: 300, borderRadius: "50%", bgcolor: alpha(theme.palette.primary.main, 0.05) }} />
        </Grid>

        {/* Right Column: Register Stepper Form */}
        <Grid size={{ xs: 12, md: 7, lg: 6 }} sx={{ 
          display: "flex", 
          flexDirection: "column",
          justifyContent: "center",
          p: { xs: 4, sm: 8, md: 10 }
        }}>
          <Box sx={{ maxWidth: 500, width: "100%", mx: "auto" }}>
            {successMessage ? (
              <Fade in timeout={800}>
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Box sx={{ p: 3, borderRadius: "50%", bgcolor: alpha(theme.palette.success.main, 0.1), color: "success.main", display: "inline-flex", mb: 3 }}>
                    <SuccessIcon size={64} />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 900, mb: 2 }}>Welcome Aboard!</Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 6, fontWeight: 500 }}>
                    {successMessage || "Your medical account has been successfully created. You can now access all features of our portal."}
                  </Typography>
                  <Button 
                    variant="contained" 
                    fullWidth 
                    size="large"
                    component={RouterLink}
                    to="/login"
                    sx={{ py: 2, borderRadius: 3, fontWeight: 800, fontSize: "1rem" }}
                  >
                    Take me to Login
                  </Button>
                </Box>
              </Fade>
            ) : (
              <>
                <Box sx={{ mb: 6 }}>
                  <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, color: "text.primary" }}>
                    Create Account
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Step {activeStep + 1} of {steps.length}: {steps[activeStep]}
                  </Typography>
                </Box>

                <Stepper activeStep={activeStep} sx={{ mb: 8, "& .MuiStepLabel-label": { fontWeight: 700, fontSize: "0.75rem" } }}>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>

                <form noValidate>
                  {renderStepContent(activeStep)}

                  {error && (
                    <Alert severity="error" variant="outlined" sx={{ mt: 4, borderRadius: 3, fontWeight: 600, borderWidth: 1.5 }}>
                      {error}
                    </Alert>
                  )}

                  <Box sx={{ display: "flex", justifyContent: "space-between", mt: 6, alignItems: "center" }}>
                    <Button
                      disabled={activeStep === 0 || isRegisterLoading}
                      onClick={handleBack}
                      startIcon={<BackIcon size={18} />}
                      sx={{ fontWeight: 700, color: "text.secondary" }}
                    >
                      Previous
                    </Button>
                    
                    {activeStep === steps.length - 1 ? (
                      <Button
                        variant="contained"
                        size="large"
                        onClick={handleSubmit}
                        disabled={isRegisterLoading}
                        sx={{ px: 5, py: 1.6, borderRadius: 3, fontWeight: 800 }}
                      >
                        {isRegisterLoading ? <CircularProgress size={24} color="inherit" /> : "Complete Registration"}
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        size="large"
                        onClick={handleNext}
                        sx={{ px: 6, py: 1.6, borderRadius: 3, fontWeight: 800 }}
                      >
                        Next Step
                      </Button>
                    )}
                  </Box>
                </form>

                <Typography align="center" variant="body2" sx={{ mt: 6, fontWeight: 500, color: "text.secondary" }}>
                  Already have an account?{" "}
                  <Link component={RouterLink} to="/login" sx={{ color: "primary.main", fontWeight: 800, textDecoration: "none" }}>
                    Sign In instead
                  </Link>
                </Typography>
              </>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RegisterPage;
