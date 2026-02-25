import { Box, Button, Typography, Grid, CircularProgress } from "@mui/material";
import { AccessTime as TimeIcon } from "@mui/icons-material";

/**
 * Grid of available time slots
 */
const AvailabilitySlots = ({ slots, selectedSlot, onSelect, isLoading }) => {
    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress size={30} />
            </Box>
        );
    }

    if (!slots || slots.length === 0) {
        return (
            <Box sx={{ textAlign: "center", py: 4, bgcolor: "rgba(0,0,0,0.02)", borderRadius: 3 }}>
                <Typography color="text.secondary">No available slots for this date.</Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2, display: "flex", alignItems: "center" }}>
                <TimeIcon sx={{ mr: 1, fontSize: "1.2rem" }} />
                Select a Time Slot
            </Typography>
            <Grid container spacing={2}>
                {slots.map((slot) => {
                    const isBooked = slot.isAvailable === false;
                    
                    return (
                        <Grid item xs={6} sm={4} md={3} key={slot._id || slot.startTime}>
                            <Button
                                fullWidth
                                variant={selectedSlot?.startTime === slot.startTime ? "contained" : "outlined"}
                                onClick={() => onSelect(slot)}
                                disabled={isBooked}
                                sx={{
                                    borderRadius: 3,
                                    py: 1.5,
                                    fontWeight: 700,
                                    textTransform: "none",
                                    position: "relative",
                                    border: "1px solid",
                                    borderColor: isBooked 
                                        ? "rgba(0,0,0,0.05)" 
                                        : selectedSlot?.startTime === slot.startTime 
                                            ? "primary.main" 
                                            : "rgba(0,0,0,0.1)",
                                    bgcolor: isBooked ? "rgba(0,0,0,0.02)" : "inherit",
                                    color: isBooked ? "text.disabled" : "inherit",
                                    transition: "all 0.2s",
                                    "&:hover": {
                                        bgcolor: isBooked ? "rgba(0,0,0,0.02)" : "primary.light",
                                        borderColor: isBooked ? "rgba(0,0,0,0.05)" : "primary.main",
                                    }
                                }}
                            >
                                <Box sx={{ textAlign: "center" }}>
                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                        {slot.startTime}
                                    </Typography>
                                    {isBooked && (
                                        <Typography 
                                            variant="caption" 
                                            sx={{ 
                                                fontSize: "0.6rem", 
                                                display: "block", 
                                                lineHeight: 1,
                                                mt: 0.5,
                                                color: "error.main",
                                                fontWeight: 800,
                                                textTransform: "uppercase"
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
