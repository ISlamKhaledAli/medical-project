import { Chip, Box } from "@mui/material";
import { 
    AccessTime as ClockIcon, 
    CheckCircle as CheckCircleIcon, 
    Cancel as CancelIcon, 
    Check as CheckIcon,
    Help as HelpIcon
} from "@mui/icons-material";

/**
 * Enterprise-grade status badge with icons and dynamic styling
 */
const STATUS_CONFIG = {
    pending: { 
        color: "#ed6c02", 
        label: "Pending", 
        bgcolor: "rgba(237, 108, 2, 0.08)", 
        icon: <ClockIcon sx={{ fontSize: "1rem !important" }} /> 
    },
    approved: { 
        color: "#2e7d32", 
        label: "Approved", 
        bgcolor: "rgba(46, 125, 50, 0.08)", 
        icon: <CheckIcon sx={{ fontSize: "1rem !important" }} /> 
    },
    confirmed: { // Alias for approved in some flows
        color: "#2e7d32", 
        label: "Confirmed", 
        bgcolor: "rgba(46, 125, 50, 0.08)", 
        icon: <CheckIcon sx={{ fontSize: "1rem !important" }} /> 
    },
    cancelled: { 
        color: "#d32f2f", 
        label: "Cancelled", 
        bgcolor: "rgba(211, 47, 47, 0.08)", 
        icon: <CancelIcon sx={{ fontSize: "1rem !important" }} /> 
    },
    completed: { 
        color: "#0288d1", 
        label: "Completed", 
        bgcolor: "rgba(2, 136, 209, 0.08)", 
        icon: <CheckCircleIcon sx={{ fontSize: "1rem !important" }} /> 
    },
    default: { 
        color: "#757575", 
        label: "Unknown", 
        bgcolor: "rgba(0, 0, 0, 0.05)", 
        icon: <HelpIcon sx={{ fontSize: "1rem !important" }} /> 
    }
};

const StatusBadge = ({ status }) => {
    const s = status?.toLowerCase() || "default";
    const config = STATUS_CONFIG[s] || STATUS_CONFIG.default;

    return (
        <Chip 
            icon={config.icon}
            label={config.label} 
            size="small" 
            sx={{ 
                height: 24,
                fontWeight: 700, 
                textTransform: "uppercase", 
                letterSpacing: 0.5,
                fontSize: "0.65rem",
                color: config.color,
                bgcolor: config.bgcolor,
                border: "1px solid",
                borderColor: "transparent",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                    bgcolor: config.bgcolor.replace("0.08", "0.15"),
                    borderColor: config.color,
                    transform: "translateY(-1px)",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                },
                "& .MuiChip-icon": {
                    color: "inherit",
                    marginLeft: "4px"
                }
            }} 
        />
    );
};

export default StatusBadge;
