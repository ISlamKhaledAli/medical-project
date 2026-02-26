import { Box, Button, Typography, Grid, alpha, useTheme } from "@mui/material";
import { Clock, Info, CheckCircle2, Lock } from "lucide-react";

/**
 * Grid of available time slots with a premium medical aesthetic
 */
const AvailabilitySlots = ({ slots, selectedSlot, onSelect, isLoading }) => {
    const theme = useTheme();

    if (isLoading) {
        return (
            <Box sx={{ display: "flex", flexDirection: 'column', alignItems: "center", py: 8, gap: 2 }}>
                <Clock className="animate-spin" size={32} color={theme.palette.primary.main} />
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Scanning available timeframes...
                </Typography>
            </Box>
        );
    }

    if (!slots || slots.length === 0) {
        return (
            <Box 
                sx={{ 
                    textAlign: "center", 
                    py: 6, 
                    px: 3,
                    bgcolor: alpha(theme.palette.error.main, 0.03), 
                    borderRadius: 4,
                    border: '1px dashed',
                    borderColor: alpha(theme.palette.error.main, 0.2)
                }}
            >
                <Info size={32} color={theme.palette.error.main} style={{ marginBottom: 12, opacity: 0.8 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'error.dark' }}>
                    No slots available
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    This doctor has no remaining availability for the selected date. Please try another day.
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 900, display: "flex", alignItems: "center", gap: 1 }}>
                    <Clock size={20} />
                    Choose a Time
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    {slots.filter(s => s.isAvailable).length} slots remaining
                </Typography>
            </Box>

            <Grid container spacing={2}>
                {slots.map((slot) => {
                    const isBooked = slot.isAvailable === false;
                    const isSelected = selectedSlot?.startTime === slot.startTime;
                    
                    return (
                        <Grid item xs={6} sm={4} key={slot._id || slot.startTime}>
                            <Button
                                fullWidth
                                onClick={() => onSelect(slot)}
                                disabled={isBooked}
                                sx={{
                                    borderRadius: 3,
                                    py: 1.8,
                                    px: 2,
                                    fontWeight: 800,
                                    textTransform: "none",
                                    position: "relative",
                                    display: 'flex',
                                    justifyContent: 'center',
                                    gap: 1.5,
                                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                                    
                                    // Base Styles
                                    border: "1px solid",
                                    borderColor: isSelected 
                                        ? "primary.main" 
                                        : isBooked ? 'transparent' : 'divider',
                                    bgcolor: isSelected 
                                        ? "primary.main" 
                                        : isBooked ? alpha(theme.palette.text.disabled, 0.05) : "white",
                                    color: isSelected 
                                        ? "white" 
                                        : isBooked ? "text.disabled" : "text.primary",
                                    
                                    boxShadow: isSelected ? `0 8px 16px ${alpha(theme.palette.primary.main, 0.2)}` : 0,

                                    "&:hover": {
                                        bgcolor: isSelected ? "primary.dark" : isBooked ? alpha(theme.palette.text.disabled, 0.05) : alpha(theme.palette.primary.main, 0.05),
                                        borderColor: isSelected ? "primary.dark" : isBooked ? 'transparent' : "primary.light",
                                        transform: isBooked ? 'none' : 'translateY(-2px)'
                                    },

                                    "&.Mui-disabled": {
                                        color: alpha(theme.palette.text.disabled, 0.4)
                                    }
                                }}
                            >
                                {isBooked ? <Lock size={14} /> : isSelected ? <CheckCircle2 size={14} /> : null}
                                <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 800 }}>
                                        {slot.startTime}
                                    </Typography>
                                    {isBooked && (
                                        <Typography 
                                            variant="caption" 
                                            sx={{ 
                                                fontSize: "0.6rem", 
                                                display: "block", 
                                                lineHeight: 1,
                                                mt: 0.3,
                                                fontWeight: 800,
                                                textTransform: "uppercase",
                                                opacity: 0.6
                                            }}
                                        >
                                            Booked
                                        </Typography>
                                    )}
                                </Box>
                            </Button>
                        </Grid>
                    );
                })}
            </Grid>
        </Box>
    );
};

export default AvailabilitySlots;
