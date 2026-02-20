import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Radio,
  Alert,
  IconButton,
  InputAdornment,
  Toolbar,
  AppBar,
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
  Tooltip,
  CircularProgress,
  Link,
} from "@mui/material";
import {
  Person as PersonIcon,
  MedicalServices as DoctorIcon,
  ChevronLeft as BackIcon,
  Visibility,
  VisibilityOff,
  Info as InfoIcon,
} from "@mui/icons-material";
import { register, clearError } from "../../features/auth/authSlice";
import { validateEmail, validatePassword, validateName, normalizeEmail } from "../../utils/validators";

const steps = ["Basic Info", "Role Selection", "Role Details"];

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, error } = useSelector((state) => state.auth);
  
  const formRef = useRef(null);

  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "patient",
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch, activeStep]);

  useEffect(() => {
    if (user) {
      const target = user.role === "admin" ? "/admin" : user.role === "doctor" ? "/doctor" : "/";
      navigate(target);
    }
  }, [user, navigate]);

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        return validateName(value);
      case "email":
        return validateEmail(value);
      case "password":
        const result = validatePassword(value);
        setPasswordStrength(result.strength);
        return result.error;
      case "confirmPassword":
        if (!value) return "Please confirm your password";
        if (value !== formData.password) return "Passwords do not match";
        return null;
      default:
        return null;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }

    if (name === "password" && touched.confirmPassword) {
        setFormErrors(prev => ({ ...prev, confirmPassword: value !== formData.confirmPassword ? "Passwords do not match" : null }));
    }

    if (error) dispatch(clearError());
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setFormErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleNext = () => {
    if (activeStep === 0) {
      const nameError = validateField("name", formData.name);
      const emailError = validateField("email", formData.email);
      const passwordError = validateField("password", formData.password);
      const confirmError = validateField("confirmPassword", formData.confirmPassword);

      if (nameError || emailError || passwordError || confirmError) {
        setFormErrors({ name: nameError, email: emailError, password: passwordError, confirmPassword: confirmError });
        setTouched({ name: true, email: true, password: true, confirmPassword: true });
        return;
      }
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const payload = {
      name: formData.name.trim(),
      email: normalizeEmail(formData.email),
      password: formData.password,
      role: formData.role,
    };

    dispatch(register(payload));
  };

  const getStrengthColor = () => {
    if (passwordStrength < 2) return "error";
    if (passwordStrength < 4) return "warning";
    return "success";
  };

  const getStrengthLabel = () => {
    if (passwordStrength === 0) return "";
    if (passwordStrength < 2) return "Weak";
    if (passwordStrength < 4) return "Fair";
    if (passwordStrength === 5) return "Strong";
    return "Good";
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 600 }}>Full Name</Typography>
            <TextField
              fullWidth
              name="name"
              placeholder="name  "
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.name && !!formErrors.name}
              helperText={touched.name && formErrors.name}
              required
              sx={{ mb: 2 }}
            />
            
            <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 600 }}>Email Address</Typography>
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
              sx={{ mb: 2 }}
            />

            <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 600 }}>
                Password 
                <Tooltip title="At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char" arrow>
                    <IconButton size="small" sx={{ ml: 0.5 }}><InfoIcon fontSize="inherit" /></IconButton>
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
              sx={{ mb: 1 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {formData.password && (
                <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">Strength: {getStrengthLabel()}</Typography>
                    </Box>
                    <LinearProgress 
                        variant="determinate" 
                        value={(passwordStrength / 5) * 100} 
                        color={getStrengthColor()} 
                        sx={{ height: 6, borderRadius: 3 }} 
                    />
                </Box>
            )}

            <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 600 }}>Confirm Password</Typography>
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
            />
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h5" align="center" sx={{ fontWeight: 700, mb: 1, color: "#1a237e" }}>
              Select Your Role
            </Typography>
            <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 4 }}>
              Registering as a Doctor or a Patient?
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Paper
                  onClick={() => setFormData((prev) => ({ ...prev, role: "doctor" }))}
                  sx={{
                    p: 3,
                    cursor: "pointer",
                    textAlign: "center",
                    border: `2px solid ${formData.role === "doctor" ? "#1976d2" : "#e0e0e0"}`,
                    bgcolor: formData.role === "doctor" ? "#f0f7ff" : "white",
                    transition: "0.2s",
                    "&:hover": { borderColor: "#1976d2" }
                  }}
                  elevation={0}
                >
                  <DoctorIcon sx={{ fontSize: 48, mb: 1, color: formData.role === "doctor" ? "#1976d2" : "#757575" }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Doctor</Typography>
                  <Typography variant="caption" color="text.secondary">Manage appointments and patients</Typography>
                  <Box sx={{ mt: 2 }}><Radio checked={formData.role === "doctor"} color="primary" /></Box>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper
                  onClick={() => setFormData((prev) => ({ ...prev, role: "patient" }))}
                  sx={{
                    p: 3,
                    cursor: "pointer",
                    textAlign: "center",
                    border: `2px solid ${formData.role === "patient" ? "#1976d2" : "#e0e0e0"}`,
                    bgcolor: formData.role === "patient" ? "#f0f7ff" : "white",
                    transition: "0.2s",
                    "&:hover": { borderColor: "#1976d2" }
                  }}
                  elevation={0}
                >
                  <PersonIcon sx={{ fontSize: 48, mb: 1, color: formData.role === "patient" ? "#1976d2" : "#757575" }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Patient</Typography>
                  <Typography variant="caption" color="text.secondary">Book and view your appointments</Typography>
                  <Box sx={{ mt: 2 }}><Radio checked={formData.role === "patient"} color="primary" /></Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: "#1a237e" }}>Review Your Account</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 4 }}>
                <Paper variant="outlined" sx={{ p: 2, textAlign: "left", borderRadius: 2 }}>
                    <Typography variant="caption" color="text.secondary">Full Name</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{formData.name}</Typography>
                </Paper>
                <Paper variant="outlined" sx={{ p: 2, textAlign: "left", borderRadius: 2 }}>
                    <Typography variant="caption" color="text.secondary">Email Address</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{formData.email}</Typography>
                </Paper>
                <Paper variant="outlined" sx={{ p: 2, textAlign: "left", borderRadius: 2 }}>
                    <Typography variant="caption" color="text.secondary">Role</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, textTransform: "capitalize" }}>{formData.role}</Typography>
                </Paper>
            </Box>
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              Final step! Click register to create your medical portal account.
            </Alert>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f4f7f9" }}>
      <AppBar position="static" sx={{ bgcolor: "white", color: "#1a237e", borderBottom: "1px solid #e0e0e0" }} elevation={0}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
             <DoctorIcon color="primary" sx={{ mr: 1 }} />
             <Typography variant="h6" sx={{ fontWeight: 800 }}>MediConnect</Typography>
          </Box>
          <Button component={RouterLink} to="/login" variant="outlined" sx={{ borderRadius: 2, textTransform: "none" }}>Sign In</Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 6 }}>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
          {renderStepContent(activeStep)}

          {error && <Alert severity="error" sx={{ mt: 3, borderRadius: 2 }}>{error}</Alert>}

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 5 }}>
            <Button
              disabled={activeStep === 0 || isLoading}
              onClick={handleBack}
              startIcon={<BackIcon />}
              sx={{ textTransform: "none", color: "text.secondary" }}
            >
              Back
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={isLoading}
                sx={{ py: 1, px: 4, borderRadius: 2, textTransform: "none", fontWeight: 700 }}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : "Register Account"}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={isLoading}
                sx={{ py: 1, px: 4, borderRadius: 2, textTransform: "none", fontWeight: 700 }}
              >
                Next Step
              </Button>
            )}
          </Box>
        </Paper>
        
        <Box sx={{ mt: 6, textAlign: "center", opacity: 0.6 }}>
            <Typography variant="caption">©  2026 MediConnect Portal. All rights reserved.</Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default RegisterPage;
