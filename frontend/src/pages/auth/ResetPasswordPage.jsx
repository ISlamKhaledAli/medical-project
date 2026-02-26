import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  LinearProgress,
  Tooltip,
  Stack,
  alpha,
  useTheme,
  Grid,
  Fade,
  Paper
} from "@mui/material";
import {
  Eye as EyeIcon,
  EyeOff as EyeOffIcon,
  Lock as LockIcon,
  Info as InfoIcon,
  PlusSquare as PlusIcon,
  CheckCircle2 as SuccessIcon,
  Key
} from "lucide-react";
import { resetPassword, clearError } from "../../features/auth/authSlice";
import { validatePassword, getStrengthLabel, getStrengthColor } from "../../utils/validators";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState({
    password: "",
    confirmPassword: "",
  });

  const [touched, setTouched] = useState({
    password: false,
    confirmPassword: false,
  });

  const [passwordStrength, setPasswordStrength] = useState(0);

  const { isLoading, error, successMessage } = useSelector((state) => state.auth);

  const validateField = (name, value) => {
    if (name === "password") {
      const result = validatePassword(value);
      setPasswordStrength(result.strength);
      return result.error;
    }
    if (name === "confirmPassword") {
      if (!value) return "Please confirm your password";
      if (value !== formData.password) return "Passwords do not match";
    }
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (name === "password") {
        validateField("password", value);
    }

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const passError = validateField("password", formData.password);
    const confirmError = validateField("confirmPassword", formData.confirmPassword);

    if (passError || confirmError) {
      setFormErrors({ password: passError, confirmPassword: confirmError });
      setTouched({ password: true, confirmPassword: true });
      return;
    }
    dispatch(resetPassword({ token, password: formData.password }));
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", bgcolor: "#fff" }}>
      <Grid container sx={{ flexGrow: 1 }}>
        {/* Left Column: Branding (Shared) */}
        <Grid item xs={12} md={5} sx={{ 
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          bgcolor: alpha(theme.palette.primary.main, 0.03),
          p: 8,
          position: "relative",
          overflow: "hidden"
        }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 10 }}>
            <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: "primary.main", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <PlusIcon color="white" size={28} strokeWidth={3} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 900 }}>MEDIC TOTAL</Typography>
          </Box>

          <Box sx={{ position: "relative", zIndex: 1, mt: "auto", mb: "auto" }}>
            <Typography variant="h3" sx={{ fontWeight: 900, mb: 3, maxWidth: 400, lineHeight: 1.2 }}>
              Secure <Box component="span" sx={{ color: "primary.main" }}>Update</Box>
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 6, maxWidth: 400, fontWeight: 500, lineHeight: 1.6 }}>
              Set a new, strong password to regain access to your medical records and appointments.
            </Typography>

            <Stack gap={4}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.03)", color: "primary.main" }}>
                  <Key size={24} />
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Strong Encryption</Typography>
                  <Typography variant="body2" color="text.secondary">Your new password is hashed with enterprise standards.</Typography>
                </Box>
              </Box>
            </Stack>
          </Box>
        </Grid>

        {/* Right Column: Reset Form */}
        <Grid item xs={12} md={7} sx={{ 
          display: "flex", 
          flexDirection: "column",
          justifyContent: "center",
          p: { xs: 4, sm: 8, md: 12 }
        }}>
          <Box sx={{ maxWidth: 420, width: "100%", mx: "auto" }}>
            <Fade in timeout={800}>
              <Box>
                {successMessage ? (
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <Box sx={{ p: 3, borderRadius: "50%", bgcolor: alpha(theme.palette.success.main, 0.1), color: "success.main", display: "inline-flex", mb: 3 }}>
                      <SuccessIcon size={64} />
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 900, mb: 2 }}>Password Reset!</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 6, fontWeight: 500 }}>
                      {successMessage || "Your password has been successfully updated. You can now sign in with your new credentials."}
                    </Typography>
                    <Button 
                      variant="contained" 
                      fullWidth 
                      size="large"
                      onClick={() => navigate("/login")}
                      sx={{ py: 2, borderRadius: 3, fontWeight: 800, fontSize: "1rem" }}
                    >
                      Sign In Now
                    </Button>
                  </Box>
                ) : (
                  <>
                    <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, color: "text.primary" }}>
                      Reset Password
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 5, fontWeight: 500 }}>
                      Enter a new secure password for your account.
                    </Typography>

                    <form onSubmit={handleSubmit} noValidate>
                      <Stack gap={3}>
                        <Box>
                          <Typography variant="body2" sx={{ mb: 1, fontWeight: 700, ml: 0.5, display: "flex", alignItems: "center" }}>
                            New Password
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
                            disabled={isLoading}
                            autoComplete="new-password"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" type="button">
                                            {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                          />
                          {formData.password && (
                                <Box sx={{ mt: 1.5, px: 0.5 }}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                                        <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary" }}>Strength: {getStrengthLabel(passwordStrength)}</Typography>
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
                          <Typography variant="body2" sx={{ mb: 1, fontWeight: 700, ml: 0.5 }}>Confirm New Password</Typography>
                          <TextField
                            fullWidth
                            name="confirmPassword"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            disabled={isLoading}
                            error={touched.confirmPassword && !!formErrors.confirmPassword}
                            helperText={touched.confirmPassword && formErrors.confirmPassword}
                            autoComplete="new-password"
                          />
                        </Box>

                        <Button
                          fullWidth
                          type="submit"
                          variant="contained"
                          size="large"
                          disabled={isLoading || (touched.password && !!formErrors.password) || (touched.confirmPassword && !!formErrors.confirmPassword) || !formData.password}
                          sx={{ py: 2, borderRadius: 3, fontWeight: 800, fontSize: "1rem", mt: 2 }}
                        >
                          {isLoading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Update Password"}
                        </Button>
                      </Stack>
                    </form>
                  </>
                )}

                {error && (
                    <Alert severity="error" variant="outlined" sx={{ mt: 4, borderRadius: 3, fontWeight: 600, borderWidth: 1.5 }}>
                        {error}
                    </Alert>
                )}
              </Box>
            </Fade>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ResetPasswordPage;
