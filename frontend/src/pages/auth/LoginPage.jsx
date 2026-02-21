import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  ToggleButton,
  ToggleButtonGroup,
  InputAdornment,
  IconButton,
  Link,
  Alert,
  Fade,
  CircularProgress,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { login, clearError } from "../../features/auth/authSlice";
import { validateEmail, normalizeEmail } from "../../utils/validators";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, error } = useSelector((state) => state.auth);
  const emailRef = useRef(null);

  const [role, setRole] = useState("doctor");
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
  }, [dispatch, role]);

  useEffect(() => {
    if (user) {
      if (user.role === "admin") navigate("/admin");
      else if (user.role === "doctor") navigate("/doctor");
      else navigate("/");
    }
  }, [user, navigate]);

  const handleRoleChange = (event, newRole) => {
    if (newRole !== null) {
      setRole(newRole);
    }
  };

  const validateField = (name, value) => {
    if (name === "email") {
      return validateEmail(value);
    }
    if (name === "password") {
      if (!value) return "Password is required";
      if (value.length < 8) return "Password must be at least 8 characters";
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
      password: formData.password.trim(),
      role,
    };

    dispatch(login(payload));
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        p: 2,
      }}
    >
      {/* Brand Logo Placeholder */}
      <Box sx={{ position: "absolute", top: 24, left: 24, display: "flex", alignItems: "center" }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              bgcolor: "#1976d2",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mr: 1
            }}
          >
             <Typography variant="h6" color="white" sx={{ fontWeight: 'bold' }}>+</Typography>
          </Box>
      </Box>

      <Fade in timeout={800}>
        <Card sx={{ maxWidth: 450, width: "100%", boxShadow: "0 8px 32px rgba(0,0,0,0.1)", borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 700, color: "#1a237e" }}>
              Secure Login
            </Typography>

            <ToggleButtonGroup
              value={role}
              exclusive
              onChange={handleRoleChange}
              fullWidth
              sx={{ my: 3, border: "1px solid #e0e0e0", borderRadius: 2 }}
            >
              <ToggleButton 
                value="doctor" 
                disabled={isLoading}
                sx={{ 
                  py: 1.5, 
                  textTransform: "none",
                  fontWeight: 600,
                  "&.Mui-selected": { bgcolor: "#1976d2", color: "white", "&:hover": { bgcolor: "#1565c0" } }
                }}
              >
                Doctor
              </ToggleButton>
              <ToggleButton 
                value="patient" 
                disabled={isLoading}
                sx={{ 
                  py: 1.5, 
                  textTransform: "none",
                  fontWeight: 600,
                  "&.Mui-selected": { bgcolor: "#1976d2", color: "white", "&:hover": { bgcolor: "#1565c0" } }
                }}
              >
                Patient
              </ToggleButton>
            </ToggleButtonGroup>

            <form onSubmit={handleSubmit} noValidate>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 600 }}>Email</Typography>
                <TextField
                  fullWidth
                  name="email"
                  inputRef={emailRef}
                  placeholder="name@company.com"
                  variant="outlined"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && !!formErrors.email}
                  helperText={touched.email && formErrors.email}
                  required
                  disabled={isLoading}
                  InputProps={{
                    endAdornment: formData.email.includes("@") && !formErrors.email && (
                      <InputAdornment position="end">
                        <CheckCircleIcon color="success" fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#fcfcfc" } }}
                />
              </Box>

              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 600 }}>Password</Typography>
                <TextField
                  fullWidth
                  name="password"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && !!formErrors.password}
                  helperText={touched.password && formErrors.password}
                  required
                  disabled={isLoading}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#fcfcfc" } }}
                />
              </Box>

              <Box sx={{ textAlign: "left", mb: 3 }}>
                <Link
                  component={RouterLink}
                  to="/forgot-password"
                  variant="body2"
                  sx={{ textDecoration: "none", fontWeight: 500 }}
                >
                  Forgot Password?
                </Link>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={isLoading || (touched.email && !!formErrors.email) || (touched.password && !!formErrors.password)}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 600,
                  boxShadow: "none",
                  position: "relative",
                  "&:hover": { boxShadow: "0 4px 12px rgba(25, 118, 210, 0.2)" }
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} sx={{ color: "white" }} />
                ) : (
                  "Sign In"
                )}
              </Button>

              <Typography align="center" variant="body2" sx={{ mt: 3, color: "text.secondary" }}>
                Don't have an account? <Link component={RouterLink} to="/register" sx={{ color: "#1976d2", fontWeight: 600, textDecoration: "none" }}>Register</Link>
              </Typography>
            </form>
          </CardContent>
        </Card>
      </Fade>

      <Box sx={{ mt: 6, display: "flex", gap: 3, opacity: 0.6 }}>
        <Typography variant="caption">©  2026 MediLink Portal. All rights reserved.</Typography>
        <Typography variant="caption">Privacy Policy</Typography>
        <Typography variant="caption">Terms of Service</Typography>
      </Box>
    </Box>
  );
};

export default LoginPage;