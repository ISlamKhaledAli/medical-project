import React from "react";
import { Box, Typography, Button, Paper, Container } from "@mui/material";
import { ErrorOutline as ErrorIcon, RestartAlt as ResetIcon } from "@mui/icons-material";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.group("ErrorBoundary caught an error:");
    console.error(error);
    console.info(errorInfo);
    console.groupEnd();
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Container maxWidth="sm">
          <Box
            sx={{
              minHeight: "60vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              py: 10,
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 5,
                borderRadius: 4,
                border: "1px solid rgba(0,0,0,0.08)",
                bgcolor: "#fff4f4",
              }}
            >
              <ErrorIcon sx={{ fontSize: 80, color: "error.main", mb: 2 }} />
              <Typography variant="h4" fontWeight={800} gutterBottom color="error.dark">
                Something went wrong
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                An unexpected error occurred in the application. We've been notified and are looking into it.
              </Typography>
              
              {process.env.NODE_ENV === "development" && (
                <Box 
                  sx={{ 
                    mb: 4, 
                    p: 2, 
                    bgcolor: "rgba(0,0,0,0.05)", 
                    borderRadius: 2, 
                    textAlign: "left",
                    overflow: "auto",
                    maxWidth: "100%",
                    maxHeight: "200px"
                  }}
                >
                  <Typography variant="caption" sx={{ fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
                    {this.state.error?.toString()}
                  </Typography>
                </Box>
              )}

              <Button
                variant="contained"
                size="large"
                startIcon={<ResetIcon />}
                onClick={handleReset}
                sx={{ 
                  borderRadius: 2, 
                  textTransform: "none", 
                  fontWeight: 700,
                  px: 4
                }}
              >
                Return Home
              </Button>
            </Paper>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
