import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Container,
    Typography,
    Box,
    Button,
    Grid,
    Card,
    CardContent,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Alert,
    Snackbar,
    Paper,
    Divider,
    CircularProgress,
} from "@mui/material";
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    AccessTime as TimeIcon,
    CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import {
    fetchDoctorAvailability,
    createAvailability,
    updateAvailability,
    deleteAvailability,
    clearAvailabilityError,
} from "../../features/availability/availabilitySlice";
import TableSkeleton from "../../components/skeletons/TableSkeleton";

const DAYS = [
    { value: 0, label: "Sunday" },
    { value: 1, label: "Monday" },
    { value: 2, label: "Tuesday" },
    { value: 3, label: "Wednesday" },
    { value: 4, label: "Thursday" },
    { value: 5, label: "Friday" },
    { value: 6, label: "Saturday" },
];

const ScheduleManagementPage = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { availabilityList, isLoading, isActionLoading, error } = useSelector((state) => state.availability);

    const [open, setOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const [formData, setFormData] = useState({
        dayOfWeek: 1,
        startTime: "09:00",
        endTime: "17:00",
        slotDuration: 30,
    });

    useEffect(() => {
        if (user?._id) {
            dispatch(fetchDoctorAvailability({ doctorId: user._id }));
        }
    }, [dispatch, user?._id]);

    const handleOpen = (item = null) => {
        if (item) {
            setEditId(item._id);
            setFormData({
                dayOfWeek: item.dayOfWeek,
                startTime: item.startTime,
                endTime: item.endTime,
                slotDuration: item.slotDuration,
            });
        } else {
            setEditId(null);
            setFormData({
                dayOfWeek: 1,
                startTime: "09:00",
                endTime: "17:00",
                slotDuration: 30,
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        dispatch(clearAvailabilityError());
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic validation
        if (formData.startTime >= formData.endTime) {
            dispatch({ type: "availability/error", payload: "End time must be after start time" });
            return;
        }

        try {
            if (editId) {
                await dispatch(updateAvailability({ id: editId, data: formData })).unwrap();
                setSnackbar({ open: true, message: "Schedule updated successfully", severity: "success" });
            } else {
                await dispatch(createAvailability(formData)).unwrap();
                setSnackbar({ open: true, message: "Schedule added successfully", severity: "success" });
            }
            handleClose();
        } catch (err) {
            // Error is handled by slice
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this time slot?")) {
            try {
                await dispatch(deleteAvailability(id)).unwrap();
                setSnackbar({ open: true, message: "Slot deleted successfully", severity: "success" });
            } catch (err) {
                // Error is handled by slice
            }
        }
    };

    const groupedAvailability = DAYS.map((day) => ({
        ...day,
        slots: availabilityList.filter((a) => a.dayOfWeek === day.value),
    }));

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: "#1a237e" }}>
                        Schedule Management
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Set your recurring weekly availability
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpen()}
                    sx={{ borderRadius: 2, px: 3, py: 1, fontWeight: 600 }}
                >
                    Add Slot
                </Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => dispatch(clearAvailabilityError())}>{error}</Alert>}

            {isLoading ? (
                <TableSkeleton rowCount={5} columnCount={4} />
            ) : (
                <Grid container spacing={3}>
                    {groupedAvailability.map((day) => (
                        <Grid item xs={12} key={day.value}>
                            <Paper sx={{ p: 2, borderRadius: 2, bgcolor: "#f8f9fa" }} elevation={0}>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                                    <CalendarIcon color="primary" fontSize="small" />
                                    {day.label}
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                
                                {day.slots.length === 0 ? (
                                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                                        No availability set for this day
                                    </Typography>
                                ) : (
                                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                                        {day.slots.map((slot) => (
                                            <Card key={slot._id} sx={{ minWidth: 280, borderRadius: 2, border: "1px solid #e0e0e0" }} elevation={0}>
                                                <CardContent sx={{ py: "16px !important", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                                        <Box sx={{ p: 1, bgcolor: "#e8efff", borderRadius: 1.5, color: "#1976d2" }}>
                                                            <TimeIcon fontSize="small" />
                                                        </Box>
                                                        <Box>
                                                            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                                                {slot.startTime} - {slot.endTime}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {slot.slotDuration} min slots
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                    <Box>
                                                        <IconButton size="small" onClick={() => handleOpen(slot)} sx={{ color: "#1976d2" }}>
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                        <IconButton size="small" onClick={() => handleDelete(slot._id)} sx={{ color: "#d32f2f" }}>
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </Box>
                                )}
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            )}

            <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>
                    {editId ? "Edit Availability" : "Add Availability"}
                </DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}>
                            <TextField
                                select
                                label="Day of Week"
                                name="dayOfWeek"
                                value={formData.dayOfWeek}
                                onChange={handleChange}
                                fullWidth
                                required
                            >
                                {DAYS.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <Box sx={{ display: "flex", gap: 2 }}>
                                <TextField
                                    label="Start Time"
                                    name="startTime"
                                    type="time"
                                    value={formData.startTime}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                    label="End Time"
                                    name="endTime"
                                    type="time"
                                    value={formData.endTime}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Box>

                            <TextField
                                label="Slot Duration (minutes)"
                                name="slotDuration"
                                type="number"
                                value={formData.slotDuration}
                                onChange={handleChange}
                                fullWidth
                                required
                                inputProps={{ min: 5, step: 5 }}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 3 }}>
                        <Button onClick={handleClose} color="inherit">Cancel</Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={isActionLoading}
                            sx={{ borderRadius: 2, px: 3 }}
                        >
                            {isActionLoading ? <CircularProgress size={24} /> : (editId ? "Update" : "Save")}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default ScheduleManagementPage;
