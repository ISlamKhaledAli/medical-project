import { Box, Typography, Button, alpha } from "@mui/material";
import { AlertCircle, RefreshCw } from "lucide-react";

/**
 * Polished Error State component with retry action
 */
const ErrorState = ({ 
  message = "Something went wrong", 
  subMessage = "We encountered an issue while processing your request. Please check your connection and try again.", 
  onRetry 
}) => (
    <Box 
        sx={{ 
            py: 12, 
            textAlign: "center", 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center",
            justifyContent: "center",
            gap: 2.5,
            width: "100%",
            maxWidth: 500,
            mx: "auto"
        }}
    >
        <Box 
          sx={{ 
            p: 3, 
            borderRadius: "50%", 
            bgcolor: "error.light", 
            color: "error.main",
            mb: 1
          }}
        >
          <AlertCircle size={64} strokeWidth={1.5} />
        </Box>
        
        <Typography variant="h5" sx={{ fontWeight: 800, color: "text.primary" }}>
            {message}
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, mx: "auto", mb: 1.5 }}>
            {subMessage}
        </Typography>
        
        {onRetry && (
            <Button 
                variant="contained" 
                color="error"
                startIcon={<RefreshCw size={18} />}
                onClick={onRetry}
                sx={{ 
                  borderRadius: 2.5, 
                  textTransform: "none", 
                  fontWeight: 700,
                  px: 4,
                  py: 1.2,
                  boxShadow: "0 4px 12px rgba(211, 47, 47, 0.2)"
                }}
            >
                Try Again
            </Button>
        )}
    </Box>
);

export default ErrorState;

