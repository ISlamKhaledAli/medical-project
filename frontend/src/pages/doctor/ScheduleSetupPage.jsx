import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Container,
    Paper,
    Typography,
    Box,
    Grid,
    Switch,
    FormControlLabel,
    MenuItem,
    Button,
    CircularProgress,
    Alert,
    Tooltip,
    TextField,
} from "@mui/material";
import { 
    LocalizationProvider, 
    TimePicker 
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {
    Save as SaveIcon,
    AccessTime as TimeIcon,
    Warning as WarningIcon,
} from "@mui/icons-material";
import { toast } from "react-hot-toast";
import { saveWeeklySchedule, fetchDoctorSchedule, clearSchedule } from "../../features/availability/availabilitySlice";
import { fetchMyProfile } from "../../features/doctor/doctorSlice";

const DAYS = [
    { label: "Sunday", value: 0 },
    { label: "Monday", value: 1 },
    { label: "Tuesday", value: 2 },
    { label: "Wednesday", value: 3 },
    { label: "Thursday", value: 4 },
    { label: "Friday", value: 5 },
    { label: "Saturday", value: 6 },
];

const ScheduleSetupPage = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { workingDays, weeklySchedule, isActionLoading, loading, isScheduleLoaded } = useSelector((state) => state.availability);

    const [error, setError] = useState(null);
    const [schedule, setSchedule] = useState(
        DAYS.map((day) => ({
            dayOfWeek: day.value,
            dayName: day.label,
            isActive: false,
            startTime: dayjs().hour(9).minute(0),
            endTime: dayjs().hour(17).minute(0),
            slotDuration: 30,
        }))
    );

    // Initial Load: Fetch doctor's profile and their schedule
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setError(null);
                const profileResult = await dispatch(fetchMyProfile()).unwrap();
                const doctorId = profileResult.data?._id || profileResult._id;
                
                if (doctorId) {
                    dispatch(fetchDoctorSchedule({ doctorId }));
                }
            } catch (err) {
                console.error("Failed to load doctor profile or schedule:", err);
                setError(err || "Failed to load schedule");
            }
        };

        loadInitialData();
        
        return () => {
            dispatch(clearSchedule());
        };
    }, [dispatch]);

    useEffect(() => {
        if (weeklySchedule && weeklySchedule.length > 0) {
            const newSchedule = DAYS.map((day) => {
                const existing = weeklySchedule.find(a => a.dayOfWeek === day.value);
                if (existing) {
                    return {
                        dayOfWeek: day.value,
                        dayName: day.label,
                        isActive: existing.isActive !== false,
                        startTime: existing.startTime ? dayjs(`2000-01-01T${existing.startTime}`) : dayjs().hour(9).minute(0),
                        endTime: existing.endTime ? dayjs(`2000-01-01T${existing.endTime}`) : dayjs().hour(17).minute(0),
                        slotDuration: existing.slotDuration || existing.slotDurationMinutes || 30,
                    };
                }
                return {
                    dayOfWeek: day.value,
                    dayName: day.label,
                    isActive: false,
                    startTime: dayjs().hour(9).minute(0),
                    endTime: dayjs().hour(17).minute(0),
                    slotDuration: 30,
                };
            });
            setSchedule(newSchedule);
        }
    }, [weeklySchedule]);

    const handleToggle = (index) => {
        const newSchedule = [...schedule];
        newSchedule[index].isActive = !newSchedule[index].isActive;
        setSchedule(newSchedule);
    };

    const handleChange = (index, field, value) => {
        const newSchedule = [...schedule];
        newSchedule[index][field] = value;
        setSchedule(newSchedule);
    };

    const calculateSlots = (start, end, duration) => {
        if (!start || !end || !dayjs.isDayjs(start) || !dayjs.isDayjs(end)) return 0;
        const startMin = start.hour() * 60 + start.minute();
        const endMin = end.hour() * 60 + end.minute();
        if (endMin <= startMin) return 0;
        return Math.floor((endMin - startMin) / duration);
    };

    const handleSave = async () => {
        setError(null);
        const activeDays = schedule.filter(d => d.isActive);
        
        // 1. Validation
        for (const day of activeDays) {
            if (!day.startTime || !day.endTime) {
                toast.error(`Please set both start and end time for ${day.dayName}`);
                return;
            }
            
            const startMin = day.startTime.hour() * 60 + day.startTime.minute();
            const endMin = day.endTime.hour() * 60 + day.endTime.minute();
            
            if (endMin <= startMin) {
                toast.error(`${day.dayName}: End time must be after start time`);
                return;
            }
        }

        // 2. Format payload
        const payload = schedule.map(day => ({
            dayOfWeek: day.dayOfWeek,
            isActive: day.isActive,
            startTime: day.startTime ? day.startTime.format("HH:mm") : "09:00",
            endTime: day.endTime ? day.endTime.format("HH:mm") : "17:00",
            slotDuration: day.slotDuration
        }));

        try {
            await dispatch(saveWeeklySchedule(payload)).unwrap();
            toast.success("Schedule saved successfully!");
        } catch (err) {
            console.error("Save failed:", err);
            setError(err || "Failed to save schedule");
            toast.error(err || "Failed to save schedule");
        }
    };

    if (loading && !isScheduleLoaded) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 900, color: "primary.main" }}>
                            Weekly Schedule
                        </Typography>
                        <Typography color="text.secondary">
                            Set your recurring weekly working hours and slot durations.
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={isActionLoading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                        onClick={handleSave}
                        disabled={isActionLoading}
                        sx={{ borderRadius: 3, px: 4, fontWeight: 700 }}
                    >
                        Save Schedule
                    </Button>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 4, borderRadius: 3 }}>
                        {error}
                    </Alert>
                )}

                {!workingDays.length && isScheduleLoaded && (
                    <Alert 
                        severity="warning" 
                        icon={<WarningIcon />}
                        sx={{ mb: 4, borderRadius: 3, fontWeight: 700 }}
                    >
                        You have no schedule set. Patients cannot book appointments with you until you set your availability.
                    </Alert>
                )}

                <Grid container spacing={3}>
                    {schedule.map((day, index) => (
                        <Grid item xs={12} key={day.dayOfWeek}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    borderRadius: 4,
                                    border: "1px solid",
                                    borderColor: day.isActive ? "primary.main" : "divider",
                                    transition: "all 0.3s",
                                    bgcolor: day.isActive ? "inherit" : "rgba(0,0,0,0.01)",
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 3 }}>
                                    <Box sx={{ minWidth: 150 }}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={day.isActive}
                                                    onChange={() => handleToggle(index)}
                                                />
                                            }
                                            label={
                                                <Typography sx={{ fontWeight: 800, color: day.isActive ? "text.primary" : "text.disabled" }}>
                                                    {day.dayName}
                                                </Typography>
                                            }
                                        />
                                    </Box>

                                    <Box sx={{ 
                                        display: "flex", 
                                        flexGrow: 1, 
                                        gap: 2, 
                                        opacity: day.isActive ? 1 : 0.4, 
                                        pointerEvents: day.isActive ? "auto" : "none",
                                        alignItems: "center"
                                    }}>
                                        <TimePicker
                                            label="Start Time"
                                            value={day.startTime}
                                            onChange={(val) => handleChange(index, "startTime", val)}
                                            slotProps={{ textField: { size: "small", sx: { width: 140 } } }}
                                        />
                                        <TimePicker
                                            label="End Time"
                                            value={day.endTime}
                                            onChange={(val) => handleChange(index, "endTime", val)}
                                            slotProps={{ textField: { size: "small", sx: { width: 140 } } }}
                                        />
                                        
                                        <TextField
                                            select
                                            label="Slot Duration"
                                            value={day.slotDuration}
                                            onChange={(e) => handleChange(index, "slotDuration", e.target.value)}
                                            size="small"
                                            sx={{ minWidth: 150 }}
                                        >
                                            <MenuItem value={15}>15 Minutes</MenuItem>
                                            <MenuItem value={30}>30 Minutes</MenuItem>
                                            <MenuItem value={45}>45 Minutes</MenuItem>
                                            <MenuItem value={60}>60 Minutes</MenuItem>
                                        </TextField>

                                        <Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
                                            <Tooltip title="Estimated slots per day">
                                                <Box sx={{ display: "flex", alignItems: "center", color: "text.secondary", bgcolor: "rgba(0,0,0,0.03)", px: 2, py: 0.5, borderRadius: 2 }}>
                                                    <TimeIcon sx={{ fontSize: "1rem", mr: 1 }} />
                                                    <Typography variant="caption" sx={{ fontWeight: 700 }}>
                                                        {day.isActive ? `${calculateSlots(day.startTime, day.endTime, day.slotDuration)} slots` : "No slots"}
                                                    </Typography>
                                                </Box>
                                            </Tooltip>
                                        </Box>
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </LocalizationProvider>
    );
};

export default ScheduleSetupPage;
