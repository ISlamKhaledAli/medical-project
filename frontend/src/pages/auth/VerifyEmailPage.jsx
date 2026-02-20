import { useState, useEffect } from "react";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  VerifiedUser as VerifyIcon,
  ErrorOutline as ErrorIcon,
} from "@mui/icons-material";
import axiosInstance from "../../api/axiosInstance";

const VerifyEmailPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await axiosInstance.get(`/auth/verify-email/${token}`);
        setStatus("success");
        setMessage(response.data.message || "Email verified successfully!");
      } catch (error) {
        setStatus("error");
        setMessage(error.response?.data?.message || "Verification failed. The link may be invalid or expired.");
      }
    };
    if (token) verify();
  }, [token]);

  return (
    <Container maxWidth="sm" sx={{ py: 12 }}>
      <Paper elevation={3} sx={{ p: 6, textAlign: "center", borderRadius: 3 }}>
        {status === "loading" && (
          <Box>
            <CircularProgress size={60} sx={{ mb: 4 }} />
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Verifying Your Email
            </Typography>
            <Typography color="text.secondary">
              Please wait while we confirm your email address...
            </Typography>
          </Box>
        )}

        {status === "success" && (
          <Box>
            <VerifyIcon color="success" sx={{ fontSize: 80, mb: 3 }} />
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: "success.main" }}>
              Email Verified!
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, color: "text.secondary" }}>
              {message}
            </Typography>
            <Button
              variant="contained"
              fullWidth
              size="large"
              component={RouterLink}
              to="/login"
              sx={{ py: 1.5, borderRadius: 2, textTransform: "none", fontWeight: 600 }}
            >
              Go to Login
            </Button>
          </Box>
        )}

        {status === "error" && (
          <Box>
            <ErrorIcon color="error" sx={{ fontSize: 80, mb: 3 }} />
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: "error.main" }}>
              Oops!
            </Typography>
            <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
              {message}
            </Alert>
            <Button
              variant="outlined"
              fullWidth
              size="large"
              component={RouterLink}
              to="/login"
              sx={{ py: 1.5, borderRadius: 2, textTransform: "none", fontWeight: 600 }}
            >
              Back to Login
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default VerifyEmailPage;
