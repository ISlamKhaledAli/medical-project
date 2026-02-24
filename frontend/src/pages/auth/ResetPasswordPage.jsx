import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  LinearProgress,
  Tooltip,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  LockReset as LockIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import { resetPassword, clearError } from "../../features/auth/authSlice";
import { validatePassword, getStrengthLabel, getStrengthColor } from "../../utils/validators";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
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
    
    // Always calculate strength if password
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

  // Removed local strength color mapper in favor of shared utility

  if (successMessage) {
    return (
      <Container maxWidth="sm" sx={{ py: 12 }}>
        <Paper elevation={3} sx={{ p: 6, textAlign: "center", borderRadius: 3 }}>
          <LockIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h5" color="success.main" gutterBottom sx={{ fontWeight: 700 }}>
            Success!
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 4 }}>
            {successMessage}
          </Typography>
          <Button 
            variant="contained" 
            fullWidth 
            onClick={() => navigate("/login")}
            sx={{ py: 1.5, borderRadius: 2, textTransform: "none", fontWeight: 700 }}
          >
            Go to Login
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 12 }}>
      <Paper elevation={3} sx={{ p: { xs: 3, sm: 6 }, borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 800, color: "#1a237e" }}>
          Reset Password
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Enter a new secure password for your account.
        </Typography>

        <form onSubmit={handleSubmit} noValidate>
          <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 600 }}>
                New Password
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
            disabled={isLoading}
            sx={{ mb: 1, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            autoComplete="new-password"
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton 
                            onClick={() => setShowPassword(!showPassword)} 
                            edge="end"
                            type="button"
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                )
            }}
          />
          {formData.password && (
                <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">Strength: {getStrengthLabel(passwordStrength)}</Typography>
                    </Box>
                    <LinearProgress 
                        variant="determinate" 
                        value={(passwordStrength / 5) * 100} 
                        color={getStrengthColor(passwordStrength)} 
                        sx={{ height: 6, borderRadius: 3 }} 
                    />
                </Box>
          )}

          <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 600 }}>Confirm New Password</Typography>
          <TextField
            fullWidth
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            disabled={isLoading}
            error={touched.confirmPassword && !!formErrors.confirmPassword}
            helperText={touched.confirmPassword && formErrors.confirmPassword}
            autoComplete="new-password"
            sx={{ mb: 4, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            size="large"
            disabled={isLoading || (touched.password && !!formErrors.password) || (touched.confirmPassword && !!formErrors.confirmPassword) || !formData.password}
            sx={{ 
                py: 1.5, 
                borderRadius: 2, 
                textTransform: "none", 
                fontWeight: 700,
                position: "relative"
            }}
          >
            {isLoading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Update Password"}
          </Button>
        </form>

        {error && (
            <Alert severity="error" sx={{ mt: 3, borderRadius: 2 }}>
                {error}
            </Alert>
        )}
      </Paper>
    </Container>
  );
};

export default ResetPasswordPage;
