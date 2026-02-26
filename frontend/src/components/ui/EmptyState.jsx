import { Box, Typography, Button, alpha } from "@mui/material";
import { SearchX, Inbox } from "lucide-react";

/**
 * Enhanced Empty State component with customizable icon and action
 */
const EmptyState = ({ 
  message = "No records found", 
  subMessage, 
  onAction, 
  actionLabel = "Refresh Page",
  icon: Icon = Inbox
}) => (
    <Box 
        sx={{ 
            py: 12, 
            textAlign: "center", 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            width: "100%",
            maxWidth: 500,
            mx: "auto"
        }}
    >
        <Box 
          sx={{ 
            p: 3, 
            borderRadius: "50%", 
            bgcolor: "action.hover", 
            color: "text.disabled",
            mb: 1
          }}
        >
          <Icon size={64} strokeWidth={1.5} />
        </Box>
        
        <Typography variant="h5" sx={{ fontWeight: 800, color: "text.primary" }}>
            {message}
        </Typography>
        
        {subMessage && (
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, mx: "auto", mb: 1 }}>
                {subMessage}
            </Typography>
        )}
        
        {onAction && (
            <Button 
                variant="outlined" 
                onClick={onAction}
                sx={{ 
                  mt: 1, 
                  borderRadius: 2.5, 
                  textTransform: "none", 
                  fontWeight: 700,
                  px: 4,
                  py: 1
                }}
            >
                {actionLabel}
            </Button>
        )}
    </Box>
);

export default EmptyState;

