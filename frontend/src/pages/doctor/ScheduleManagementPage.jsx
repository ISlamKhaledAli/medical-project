import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Typography,
    Box,
    Grid,
    Switch,
    FormControlLabel,
    MenuItem,
    Button,
    Alert,
    Tooltip,
    TextField,
    alpha,
    useTheme,
    Stack,
    Paper,
    Divider
} from "@mui/material";
import { 
    LocalizationProvider, 
    TimePicker 
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {
    Save,
    Clock,
    AlertTriangle,
    Calendar,
    Settings2,
    CheckCircle2,
    Info,
    ChevronRight
} from "lucide-react";
import { toast } from "react-hot-toast";
import { saveWeeklySchedule, fetchDoctorSchedule, clearSchedule } from "../../features/availability/availabilitySlice";
import { fetchMyProfile } from "../../features/doctor/doctorSlice";
import PageHeader from "../../components/ui/PageHeader";
import SectionCard from "../../components/ui/SectionCard";
import GlobalLoader from "../../components/ui/GlobalLoader";

const DAYS = [
    { label: "Sunday", value: 0 },
    { label: "Monday", value: 1 },
    { label: "Tuesday", value: 2 },
    { label: "Wednesday", value: 3 },
    { label: "Thursday", value: 4 },
    { label: "Friday", value: 5 },
    { label: "Saturday", value: 6 },
];

const ScheduleManagementPage = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const { weeklySchedule, isActionLoading, loading, isScheduleLoaded } = useSelector((state) => state.availability);

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
                setError(err || "Failed to load schedule patterns");
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
                        ...day,
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
        
        for (const day of activeDays) {
            const startMin = day.startTime.hour() * 60 + day.startTime.minute();
            const endMin = day.endTime.hour() * 60 + day.endTime.minute();
            
            if (endMin <= startMin) {
                toast.error(`${day.dayName}: End time must be after start time`);
                return;
            }
        }

        const payload = schedule.map(day => ({
            dayOfWeek: day.dayOfWeek,
            isActive: day.isActive,
            startTime: day.startTime ? day.startTime.format("HH:mm") : "09:00",
            endTime: day.endTime ? day.endTime.format("HH:mm") : "17:00",
            slotDuration: day.slotDuration
        }));

        try {
            await dispatch(saveWeeklySchedule(payload)).unwrap();
            toast.success("Schedule updated successfully!");
        } catch (err) {
            setError(err || "Failed to commit schedule changes");
            toast.error(err || "Failed to save schedule");
        }
    };

    if (loading && !isScheduleLoaded) return <GlobalLoader message="Retrieving your clinical patterns..." />;

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ maxWidth: "100%", overflowX: "hidden" }}>
                <PageHeader 
                    title="Clinical Availability"
                    subtitle="Define your recurring weekly schedule. These patterns automatically generate bookable slots for patients."
                    breadcrumbs={[
                        { label: "Dashboard", path: "/doctor" },
                        { label: "Schedule Management", active: true }
                    ]}
                    action={{
                        label: isActionLoading ? "Saving..." : "Commit Changes",
                        icon: Save,
                        onAction: handleSave,
                        disabled: isActionLoading,
                        color: 'primary'
                    }}
                />

                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, lg: 8 }}>
                        <SectionCard 
                            title="Weekly Pattern" 
                            subtitle="Configure active days and session durations"
                        >
                            <Stack spacing={2} sx={{ mt: 1 }}>
                                {schedule.map((day, index) => (
                                    <Paper
                                        key={day.dayOfWeek}
                                        elevation={0}
                                        sx={{
                                            p: 2.5,
                                            borderRadius: 4,
                                            border: "1px solid",
                                            borderColor: day.isActive 
                                                ? alpha(theme.palette.primary.main, 0.4) 
                                                : (theme.palette.mode === 'dark' ? alpha('#fff', 0.08) : "divider"),
                                            bgcolor: day.isActive ? "background.paper" : "transparent",
                                            transition: "all 0.3s ease",
                                            overflow: "hidden",
                                            "&:hover": { borderColor: alpha(theme.palette.primary.main, 0.4) }
                                        }}
                                    >
                                        <Grid container alignItems="center" spacing={3}>
                                            <Grid size={{ xs: 12, sm: 4, md: 3 }}>
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            checked={day.isActive}
                                                            onChange={() => handleToggle(index)}
                                                            color="primary"
                                                            sx={{ 
                                                                '& .MuiSwitch-switchBase.Mui-checked': { color: 'primary.main' },
                                                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: 'primary.main' }
                                                            }}
                                                        />
                                                    }
                                                    label={
                                                        <Typography sx={{ 
                                                            fontWeight: 900, 
                                                            color: day.isActive ? "text.primary" : "text.disabled",
                                                            fontSize: '1rem',
                                                            ml: 1
                                                        }}>
                                                            {day.dayName}
                                                        </Typography>
                                                    }
                                                />
                                            </Grid>

                                            <Grid size={{ xs: 12, sm: 8, md: 9 }}>
                                                <Stack 
                                                    direction={{ xs: 'column', md: 'row' }} 
                                                    spacing={2} 
                                                    alignItems="center"
                                                    sx={{ 
                                                        opacity: day.isActive ? 1 : 0.4, 
                                                        pointerEvents: day.isActive ? "auto" : "none" 
                                                    }}
                                                >
                                                    <Box sx={{ 
                                                        display: 'flex', 
                                                        gap: 1.5, 
                                                        width: '100%', 
                                                        flexGrow: 1,
                                                        flexWrap: { xs: 'wrap', sm: 'nowrap' },
                                                        minWidth: 0
                                                    }}>
                                                        <TimePicker
                                                            label="Start Shift"
                                                            value={day.startTime}
                                                            onChange={(val) => handleChange(index, "startTime", val)}
                                                            slotProps={{ 
                                                                textField: { 
                                                                    size: "small", 
                                                                    fullWidth: true,
                                                                    sx: { '& .MuiOutlinedInput-root': { borderRadius: 2.5 } } 
                                                                } 
                                                            }}
                                                        />
                                                        <TimePicker
                                                            label="End Shift"
                                                            value={day.endTime}
                                                            onChange={(val) => handleChange(index, "endTime", val)}
                                                            slotProps={{ 
                                                                textField: { 
                                                                    size: "small", 
                                                                    fullWidth: true,
                                                                    sx: { '& .MuiOutlinedInput-root': { borderRadius: 2.5 } } 
                                                                } 
                                                            }}
                                                        />
                                                    </Box>

                                                    <TextField
                                                        select
                                                        label="Session"
                                                        value={day.slotDuration}
                                                        onChange={(e) => handleChange(index, "slotDuration", e.target.value)}
                                                        size="small"
                                                        sx={{ 
                                                            minWidth: 120,
                                                            '& .MuiOutlinedInput-root': { borderRadius: 2.5 } 
                                                        }}
                                                    >
                                                        <MenuItem value={15} sx={{ fontWeight: 700 }}>15 min</MenuItem>
                                                        <MenuItem value={30} sx={{ fontWeight: 700 }}>30 min</MenuItem>
                                                        <MenuItem value={45} sx={{ fontWeight: 700 }}>45 min</MenuItem>
                                                        <MenuItem value={60} sx={{ fontWeight: 700 }}>60 min</MenuItem>
                                                    </TextField>

                                                    <Box 
                                                        sx={{ 
                                                            display: "flex", 
                                                            alignItems: "center", 
                                                            gap: 1, 
                                                            px: 2, 
                                                            py: 0.8, 
                                                            borderRadius: 2.5, 
                                                            bgcolor: day.isActive ? alpha(theme.palette.success.main, 0.05) : "transparent",
                                                            border: '1px solid',
                                                            borderColor: day.isActive ? alpha(theme.palette.success.main, 0.1) : 'transparent',
                                                            color: day.isActive ? 'success.dark' : 'text.disabled',
                                                            minWidth: { xs: '100%', md: 110 },
                                                            justifyContent: 'center',
                                                            flexShrink: 0
                                                        }}
                                                    >
                                                        <Clock size={14} />
                                                        <Typography variant="caption" sx={{ fontWeight: 900 }}>
                                                            {day.isActive ? `${calculateSlots(day.startTime, day.endTime, day.slotDuration)} slots` : "--"}
                                                        </Typography>
                                                    </Box>
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                ))}
                            </Stack>
                        </SectionCard>
                    </Grid>

                    <Grid size={{ xs: 12, lg: 4 }}>
                        <Stack spacing={3}>
                            <SectionCard title="Schedule Insight" icon={Info}>
                                <Stack spacing={3}>
                                    <Box>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1, color: 'primary.main' }}>
                                            How it works
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, lineHeight: 1.6 }}>
                                            The system calculates available slots by dividing your shift duration into equal patient sessions. 
                                        </Typography>
                                    </Box>

                                    <Divider />

                                    <Stack spacing={2}>
                                        <Box sx={{ display: 'flex', gap: 2 }}>
                                            <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', height: 'fit-content' }}>
                                                <Calendar size={18} />
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" sx={{ fontWeight: 900, display: 'block' }}>Regular Flow</Typography>
                                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>Active days are visible to all patients.</Typography>
                                            </Box>
                                        </Box>
                                        <Box sx={{ display: 'flex', gap: 2 }}>
                                            <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: alpha(theme.palette.warning.main, 0.1), color: 'warning.main', height: 'fit-content' }}>
                                                <Settings2 size={18} />
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" sx={{ fontWeight: 900, display: 'block' }}>Custom Durations</Typography>
                                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>Shorter sessions increase patient throughput.</Typography>
                                            </Box>
                                        </Box>
                                    </Stack>

                                    {schedule.filter(d => d.isActive).length === 0 && (
                                        <Alert 
                                            severity="warning" 
                                            icon={<AlertTriangle size={20} />}
                                            sx={{ 
                                                mb: 4, 
                                                borderRadius: "16px",
                                                bgcolor: alpha(theme.palette.warning.main, 0.08),
                                                color: "warning.dark",
                                                border: "1px solid",
                                                borderColor: alpha(theme.palette.warning.main, 0.2),
                                                fontWeight: 600,
                                                py: 1.5,
                                                px: 2.5
                                            }}
                                        >
                                            Your profile is currently invisible to patients as no work days are active.
                                        </Alert>
                                    )}
                                </Stack>
                            </SectionCard>

                            <Paper 
                                elevation={0}
                                sx={{ 
                                    p: 3, 
                                    borderRadius: 4, 
                                    bgcolor: alpha(theme.palette.primary.main, 0.02),
                                    border: '1px dashed',
                                    borderColor: alpha(theme.palette.primary.main, 0.2)
                                }}
                            >
                                <Typography variant="h3" sx={{ fontWeight: 900, color: 'primary.main', mb: 0.5 }}>
                                    {schedule.filter(d => d.isActive).length}
                                </Typography>
                                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                    Active Working Days
                                </Typography>
                            </Paper>
                        </Stack>
                    </Grid>
                </Grid>

                {error && (
                    <Alert 
                        severity="error" 
                        sx={{ 
                            mt: 3, 
                            borderRadius: "16px",
                            bgcolor: alpha(theme.palette.error.main, 0.08),
                            color: "error.dark",
                            border: "1px solid",
                            borderColor: alpha(theme.palette.error.main, 0.2),
                            fontWeight: 600,
                            py: 1.5,
                            px: 2.5
                        }}
                    >
                        {error}
                    </Alert>
                )}
            </Box>
        </LocalizationProvider>
    );
};

export default ScheduleManagementPage;
