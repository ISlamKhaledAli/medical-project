import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { forgotPassword, clearError } from "../../features/auth/authSlice";
import { validateEmail, normalizeEmail } from "../../utils/validators";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [touched, setTouched] = useState(false);
  
  const dispatch = useDispatch();
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
    <Container maxWidth="sm" sx={{ py: 12 }}>
        <IconButton 
            component={RouterLink} 
            to="/login" 
            sx={{ mb: 2, display: "inline-flex", alignItems: "center", gap: 1 }}
            disabled={isLoading}
        >
            <ArrowBackIcon />
        </IconButton>
      <Paper elevation={3} sx={{ p: { xs: 3, sm: 6 }, borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 800, color: "#1a237e" }}>
          Forgot Password
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Enter your email and we'll send you a link to reset your password.
        </Typography>

        {successMessage ? (
          <Alert severity="success" sx={{ mb: 4, borderRadius: 2 }}>
            {successMessage}
          </Alert>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 600 }}>Email Address</Typography>
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
              sx={{ mb: 4, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={isLoading || (touched && !!emailError) || !email}
              sx={{ 
                py: 1.5, 
                borderRadius: 2, 
                textTransform: "none", 
                fontWeight: 700,
                position: "relative"
              }}
            >
              {isLoading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Send Reset Link"}
            </Button>
          </form>
        )}

        {error && (
            <Alert severity="error" sx={{ mt: 3, borderRadius: 2 }}>
                {error}
            </Alert>
        )}
      </Paper>
    </Container>
  );
};

export default ForgotPasswordPage;
