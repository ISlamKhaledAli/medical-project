import { Chip } from "@mui/material";

/**
 * Semantic badge for appointment status
 */
const StatusBadge = ({ status }) => {
    const getStatusConfig = (s) => {
        switch (s?.toLowerCase()) {
            case "pending":
                return { color: "warning", label: "Pending", bgcolor: "rgba(237, 108, 2, 0.1)" };
            case "confirmed":
                return { color: "success", label: "Confirmed", bgcolor: "rgba(46, 125, 50, 0.1)" };
            case "cancelled":
                return { color: "error", label: "Cancelled", bgcolor: "rgba(211, 47, 47, 0.1)" };
            case "completed":
                return { color: "info", label: "Completed", bgcolor: "rgba(2, 136, 209, 0.1)" };
            default:
                return { color: "default", label: s || "Unknown", bgcolor: "rgba(0, 0, 0, 0.05)" };
        }
    };

    const config = getStatusConfig(status);

    return (
        <Chip 
            label={config.label} 
            color={config.color} 
            size="small" 
            sx={{ 
                fontWeight: 800, 
                textTransform: "uppercase", 
                letterSpacing: 0.5,
                fontSize: "0.65rem",
                bgcolor: config.bgcolor,
                border: "1px solid",
                borderColor: `${config.color}.main`,
                px: 1
            }} 
        />
    );
};

export default StatusBadge;
