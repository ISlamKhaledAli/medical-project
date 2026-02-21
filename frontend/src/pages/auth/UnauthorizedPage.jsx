import { Container, Box, Typography, Button, Paper } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { GppBad as ShieldIcon } from "@mui/icons-material";

const UnauthorizedPage = () => {
  return (
    <Container maxWidth="sm" sx={{ py: 12 }}>
      <Paper elevation={3} sx={{ p: 8, textAlign: "center", borderRadius: 4 }}>
        <ShieldIcon color="error" sx={{ fontSize: 100, mb: 4, opacity: 0.8 }} />
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 800, color: "#d32f2f" }}>
          Access Denied
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 5, lineHeight: 1.6 }}>
          Oops! You don't have the required permissions to view this page. Please contact your administrator if you believe this is an error.
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
            boxShadow: "0 8px 24px rgba(211, 47, 47, 0.2)",
            "&:hover": { bgcolor: "#b71c1c" }
          }}
        >
          Return to Dashboard
        </Button>
      </Paper>
    </Container>
  );
};

export default UnauthorizedPage;
