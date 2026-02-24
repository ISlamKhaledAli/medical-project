import { Box, Typography, Button } from "@mui/material";
import { ErrorOutline as ErrorIcon } from "@mui/icons-material";

const ErrorState = ({ message = "Something went wrong", onRetry }) => (
    <Box 
        sx={{ 
            py: 10, 
            textAlign: "center", 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center",
            gap: 2
        }}
    >
        <ErrorIcon color="error" sx={{ fontSize: "5rem", opacity: 0.8 }} />
        <Typography variant="h5" sx={{ fontWeight: 800, color: "error.main" }}>
            {message}
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 400, mx: "auto", mb: 2 }}>
            We encountered an issue while fetching data. Please check your connection and try again.
        </Typography>
        {onRetry && (
            <Button 
                variant="contained" 
                color="primary"
                onClick={onRetry}
                sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700, px: 4 }}
            >
                Try Again
            </Button>
        )}
    </Box>
);

export default ErrorState;
