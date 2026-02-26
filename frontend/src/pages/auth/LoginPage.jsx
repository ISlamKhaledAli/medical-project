import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Link,
  Alert,
  Fade,
  CircularProgress,
  Stack,
  alpha,
  useTheme,
  Grid
} from "@mui/material";
import {
  Eye as EyeIcon,
  EyeOff as EyeOffIcon,
  CheckCircle2 as CheckCircleIcon,
  PlusSquare as PlusIcon,
  Stethoscope,
  ShieldCheck,
  Calendar
} from "lucide-react";
import { login, clearError } from "../../features/auth/authSlice";
import { validateEmail, normalizeEmail } from "../../utils/validators";
import { ROLES } from "../../constants/roles";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const { user, isLoading, error } = useSelector((state) => state.auth);
  const emailRef = useRef(null);

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      const roleLower = user.role?.toLowerCase();
      if (roleLower === ROLES.ADMIN.toLowerCase()) navigate("/admin");
      else if (roleLower === ROLES.DOCTOR.toLowerCase()) navigate("/doctor/dashboard");
      else navigate("/patient");
    }
  }, [user, navigate]);

  const validateField = (name, value) => {
    if (name === "email") {
      return validateEmail(value);
    }
    if (name === "password") {
      return !value ? "Password is required" : "";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user types
    if (touched[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
    
    if (error) dispatch(clearError());
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setFormErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const emailError = validateField("email", formData.email);
    const passwordError = validateField("password", formData.password);

    if (emailError || passwordError) {
      setFormErrors({ email: emailError, password: passwordError });
      setTouched({ email: true, password: true });
      return;
    }

    const payload = {
      email: normalizeEmail(formData.email),
      password: formData.password,
    };

    dispatch(login(payload));
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", bgcolor: "#fff" }}>
      <Grid container sx={{ flexGrow: 1 }}>
        {/* Left Column: Branding & Illustration */}
        <Grid size={{ xs: 12, md: 6, lg: 7 }} sx={{ 
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          bgcolor: alpha(theme.palette.primary.main, 0.03),
          p: 8,
          position: "relative",
          overflow: "hidden"
        }}>
          {/* Logo */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 10 }}>
            <Box 
              sx={{ 
                width: 48, 
                height: 48, 
                borderRadius: 2.5, 
                bgcolor: "primary.main", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(21, 101, 192, 0.2)"
              }}
            >
              <PlusIcon color="white" size={30} strokeWidth={3} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: 1, color: "text.primary" }}>
              MEDIC TOTAL
            </Typography>
          </Box>

          <Box sx={{ position: "relative", zIndex: 1, mt: "auto", mb: "auto" }}>
            <Typography variant="h2" sx={{ fontWeight: 900, mb: 3, maxWidth: 500, lineHeight: 1.1 }}>
              Professional Care for <Box component="span" sx={{ color: "primary.main" }}>Everyone</Box>
            </Typography>
            <Typography variant="h5" color="text.secondary" sx={{ mb: 6, maxWidth: 450, fontWeight: 500, lineHeight: 1.6 }}>
              The most advanced digital health system for doctors and patients. Managing appointments has never been easier.
            </Typography>

            <Stack gap={3}>
              {[
                { icon: Stethoscope, title: "Verified Professionals", desc: "Access to top-tier verified medical doctors." },
                { icon: Calendar, title: "Smart Scheduling", desc: "Easily manage and reschedule your appointments." },
                { icon: ShieldCheck, title: "Secure Data", desc: "Your medical history is protected with enterprise security." }
              ].map((feature, i) => (
                <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
                  <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.03)", color: "primary.main" }}>
                    <feature.icon size={24} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>{feature.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{feature.desc}</Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Abstract background shapes */}
          <Box sx={{ 
            position: "absolute", 
            bottom: -150, 
            left: -150, 
            width: 400, 
            height: 400, 
            borderRadius: "50%", 
            bgcolor: alpha(theme.palette.primary.main, 0.05),
            zIndex: 0
          }} />
          <Box sx={{ 
            position: "absolute", 
            top: "20%", 
            right: -100, 
            width: 300, 
            height: 300, 
            borderRadius: "50%", 
            bgcolor: alpha(theme.palette.secondary.main, 0.05),
            zIndex: 0
          }} />
        </Grid>

        {/* Right Column: Login Form */}
        <Grid size={{ xs: 12, md: 6, lg: 5 }} sx={{ 
          display: "flex", 
          flexDirection: "column",
          justifyContent: "center",
          p: { xs: 4, sm: 8, md: 10 }
        }}>
          <Fade in timeout={800}>
            <Box sx={{ maxWidth: 420, width: "100%", mx: "auto" }}>
              <Box sx={{ mb: 5 }}>
                <Typography variant="h4" sx={{ fontWeight: 900, mb: 1.5, color: "text.primary" }}>
                  Welcome back
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Please enter your details to access your account.
                </Typography>
              </Box>

              <form onSubmit={handleSubmit} noValidate>
                <Stack gap={3}>
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 700, ml: 0.5 }}>
                      Email Address
                    </Typography>
                    <TextField
                      fullWidth
                      name="email"
                      inputRef={emailRef}
                      placeholder="e.g. james@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.email && !!formErrors.email}
                      helperText={touched.email && formErrors.email}
                      autoComplete="email"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Box sx={{ color: formData.email ? "primary.main" : "text.disabled", display: "flex", mr: 1 }}>
                              <PlusIcon size={18} />
                            </Box>
                          </InputAdornment>
                        ),
                        endAdornment: formData.email.includes("@") && !formErrors.email && (
                          <InputAdornment position="end">
                            <CheckCircleIcon color="success" size={20} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>

                  <Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, ml: 0.5 }}>
                        Password
                      </Typography>
                      <Link
                        component={RouterLink}
                        to="/forgot-password"
                        variant="caption"
                        sx={{ textDecoration: "none", fontWeight: 700, color: "primary.main" }}
                      >
                        Forgot Password?
                      </Link>
                    </Box>
                    <TextField
                      fullWidth
                      name="password"
                      placeholder="••••••••"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.password && !!formErrors.password}
                      helperText={touched.password && formErrors.password}
                      autoComplete="current-password"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              size="small"
                              type="button"
                            >
                              {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>

                  {error && (
                    <Alert 
                      severity="error" 
                      variant="outlined"
                      sx={{ 
                        borderRadius: 3, 
                        fontWeight: 600,
                        borderWidth: 1.5,
                        bgcolor: alpha(theme.palette.error.main, 0.02)
                      }}
                    >
                      {error}
                    </Alert>
                  )}

                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={isLoading}
                    sx={{
                      py: 1.8,
                      fontSize: "1rem",
                      boxShadow: "0 8px 16px rgba(21, 101, 192, 0.2)",
                      "&:hover": {
                        boxShadow: "0 12px 24px rgba(21, 101, 192, 0.3)",
                      }
                    }}
                  >
                    {isLoading ? (
                      <CircularProgress size={24} sx={{ color: "white" }} />
                    ) : (
                      "Sign In to Account"
                    )}
                  </Button>

                  <Typography align="center" variant="body2" sx={{ mt: 2, fontWeight: 500, color: "text.secondary" }}>
                    New to Medic Total?{" "}
                    <Link 
                      component={RouterLink} 
                      to="/register" 
                      sx={{ color: "primary.main", fontWeight: 800, textDecoration: "none" }}
                    >
                      Create Account
                    </Link>
                  </Typography>
                </Stack>
              </form>
            </Box>
          </Fade>

          <Box sx={{ mt: "auto", pt: 4, display: "flex", justifyContent: "center", gap: 3, opacity: 0.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>Privacy</Typography>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>Terms</Typography>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>Help</Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LoginPage;