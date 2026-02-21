import { Container, Box, Typography, Button, Paper } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { BugReport as BugIcon } from "@mui/icons-material";

const NotFoundPage = () => {
  return (
    <Container maxWidth="sm" sx={{ py: 12 }}>
      <Paper elevation={3} sx={{ p: 8, textAlign: "center", borderRadius: 4, bgcolor: "#fafafa" }}>
        <Typography variant="h1" gutterBottom sx={{ fontWeight: 900, color: "#1a237e", fontSize: { xs: "5rem", md: "8rem" }, mb: 0 }}>
          404
        </Typography>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: "text.primary" }}>
          Page Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 5, fontSize: "1.1rem" }}>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </Typography>
        <Button
          variant="contained"
          size="large"
          component={RouterLink}
          to="/"
          sx={{
            py: 2,
            px: 6,
            borderRadius: 3,
            textTransform: "none",
            fontSize: "1.1rem",
            fontWeight: 700,
            boxShadow: "0 8px 24px rgba(25, 118, 210, 0.2)"
          }}
        >
          Back to Home
        </Button>
      </Paper>
    </Container>
  );
};

export default NotFoundPage;
