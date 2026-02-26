import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  IconButton,
  CircularProgress,
  Stack,
  alpha,
  useTheme,
  Grid,
  Fade
} from "@mui/material";
import { 
  ChevronLeft as ArrowBackIcon,
  PlusSquare as PlusIcon,
  Mail,
  ShieldCheck,
  Stethoscope
} from "lucide-react";
import { forgotPassword, clearError } from "../../features/auth/authSlice";
import { validateEmail, normalizeEmail } from "../../utils/validators";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [touched, setTouched] = useState(false);
  
  const dispatch = useDispatch();
  const theme = useTheme();
  const { isLoading, error, successMessage } = useSelector((state) => state.auth);

  const handleBlur = () => {
    setTouched(true);
    setEmailError(validateEmail(email));
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (touched) {
      setEmailError(validateEmail(value));
    }
    if (error) dispatch(clearError());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validateEmail(email);
    if (validationError) {
      setEmailError(validationError);
      setTouched(true);
      return;
    }
    dispatch(forgotPassword(normalizeEmail(email)));
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", bgcolor: "#fff" }}>
      <Grid container sx={{ flexGrow: 1 }}>
        {/* Left Column: Branding (Shared) */}
        <Grid size={{ xs: 12, md: 5 }} sx={{ 
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
              Account <Box component="span" sx={{ color: "primary.main" }}>Recovery</Box>
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 6, maxWidth: 400, fontWeight: 500, lineHeight: 1.6 }}>
              Don't worry, it happens to the best of us. We'll help you get back to your medical dashboard in no time.
            </Typography>

            <Stack gap={4}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.03)", color: "primary.main" }}>
                  <ShieldCheck size={24} />
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Secure Recovery</Typography>
                  <Typography variant="body2" color="text.secondary">Identity-verified password reset process.</Typography>
                </Box>
              </Box>
            </Stack>
          </Box>
        </Grid>

        {/* Right Column: Recovery Form */}
        <Grid size={{ xs: 12, md: 7 }} sx={{ 
          display: "flex", 
          flexDirection: "column",
          justifyContent: "center",
          p: { xs: 4, sm: 8, md: 12 }
        }}>
          <Box sx={{ maxWidth: 420, width: "100%", mx: "auto" }}>
            <Button 
                component={RouterLink} 
                to="/login" 
                startIcon={<ArrowBackIcon size={18} />}
                sx={{ mb: 6, fontWeight: 700, color: "text.secondary", textTransform: "none" }}
                disabled={isLoading}
            >
                Back to Sign In
            </Button>

            <Fade in timeout={800}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, color: "text.primary" }}>
                  Forgot Password?
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 5, fontWeight: 500 }}>
                  Enter your email and we'll send you a link to reset your password.
                </Typography>

                {successMessage ? (
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <Box sx={{ p: 3, borderRadius: "50%", bgcolor: alpha(theme.palette.success.main, 0.1), color: "success.main", display: "inline-flex", mb: 3 }}>
                      <Mail size={48} />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 900, mb: 1.5 }}>Check your email</Typography>
                    <Alert severity="success" sx={{ borderRadius: 3, fontWeight: 600, mb: 4 }}>
                      {successMessage}
                    </Alert>
                    <Button 
                      variant="outlined" 
                      fullWidth 
                      size="large"
                      component={RouterLink}
                      to="/login"
                      sx={{ py: 1.5, borderRadius: 3, fontWeight: 700 }}
                    >
                      Return to Login
                    </Button>
                  </Box>
                ) : (
                  <form onSubmit={handleSubmit} noValidate>
                    <Stack gap={4}>
                      <Box>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 700, ml: 0.5 }}>Email Address</Typography>
                        <TextField
                          fullWidth
                          name="email"
                          placeholder="name@company.com"
                          type="email"
                          value={email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched && !!emailError}
                          helperText={touched && emailError}
                          required
                          disabled={isLoading}
                          autoComplete="email"
                        />
                      </Box>
                      
                      <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={isLoading || (touched && !!emailError) || !email}
                        sx={{ py: 2, borderRadius: 3, fontWeight: 800, fontSize: "1rem" }}
                      >
                        {isLoading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Send Reset Instructions"}
                      </Button>
                    </Stack>
                  </form>
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

export default ForgotPasswordPage;
