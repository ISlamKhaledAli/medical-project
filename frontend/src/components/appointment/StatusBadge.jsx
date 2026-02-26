import { Chip, Box } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
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
const StatusBadge = ({ status }) => {
    const theme = useTheme();
    const s = status?.toLowerCase() || "default";

    const config = {
        pending: { 
            color: theme.palette.warning.main, 
            label: "Pending", 
            icon: <ClockIcon sx={{ fontSize: "1rem !important" }} /> 
        },
        approved: { 
            color: theme.palette.success.main, 
            label: "Approved", 
            icon: <CheckIcon sx={{ fontSize: "1rem !important" }} /> 
        },
        confirmed: { 
            color: theme.palette.success.main, 
            label: "Confirmed", 
            icon: <CheckIcon sx={{ fontSize: "1rem !important" }} /> 
        },
        cancelled: { 
            color: theme.palette.error.main, 
            label: "Cancelled", 
            icon: <CancelIcon sx={{ fontSize: "1rem !important" }} /> 
        },
        completed: { 
            color: theme.palette.info.main, 
            label: "Completed", 
            icon: <CheckCircleIcon sx={{ fontSize: "1rem !important" }} /> 
        },
        default: { 
            color: theme.palette.text.disabled, 
            label: "Unknown", 
            icon: <HelpIcon sx={{ fontSize: "1rem !important" }} /> 
        }
    }[s] || { 
        color: theme.palette.text.disabled, 
        label: "Unknown", 
        icon: <HelpIcon sx={{ fontSize: "1rem !important" }} /> 
    };

    const bgcolor = alpha(config.color, 0.1);

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
                bgcolor: bgcolor,
                border: "1px solid",
                borderColor: alpha(config.color, 0.1),
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                    bgcolor: alpha(config.color, 0.15),
                    borderColor: config.color,
                    transform: "translateY(-1px)",
                    boxShadow: theme.palette.mode === "dark" 
                        ? `0 2px 8px ${alpha(config.color, 0.2)}` 
                        : "0 2px 4px rgba(0,0,0,0.05)"
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
