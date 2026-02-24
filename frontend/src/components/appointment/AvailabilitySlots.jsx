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
                {slots.map((slot) => (
                    <Grid item xs={6} sm={4} md={3} key={slot.id || slot.time}>
                        <Button
                            fullWidth
                            variant={selectedSlot?.time === slot.time ? "contained" : "outlined"}
                            onClick={() => onSelect(slot)}
                            disabled={!slot.isAvailable}
                            sx={{
                                borderRadius: 3,
                                py: 1.5,
                                fontWeight: 700,
                                textTransform: "none",
                                border: "1px solid",
                                borderColor: selectedSlot?.time === slot.time ? "primary.main" : "rgba(0,0,0,0.1)",
                                opacity: slot.isAvailable ? 1 : 0.5
                            }}
                        >
                            {slot.time}
                        </Button>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default AvailabilitySlots;
