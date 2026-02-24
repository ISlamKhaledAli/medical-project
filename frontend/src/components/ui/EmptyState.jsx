import { Box, Typography, Button } from "@mui/material";
import { SearchOff as SearchOffIcon } from "@mui/icons-material";

const EmptyState = ({ message = "No records found", subMessage, onClear }) => (
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
        <SearchOffIcon sx={{ fontSize: "5rem", color: "rgba(0,0,0,0.1)" }} />
        <Typography variant="h5" sx={{ fontWeight: 800, color: "text.primary" }}>
            {message}
        </Typography>
        {subMessage && (
            <Typography color="text.secondary" sx={{ maxWidth: 400, mx: "auto" }}>
                {subMessage}
            </Typography>
        )}
        {onClear && (
            <Button 
                variant="outlined" 
                onClick={onClear}
                sx={{ mt: 2, borderRadius: 2, textTransform: "none", fontWeight: 700 }}
            >
                Clear All Filters
            </Button>
        )}
    </Box>
);

export default EmptyState;
