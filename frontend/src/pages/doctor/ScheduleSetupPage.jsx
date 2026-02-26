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
    Sparkles,
    MousePointerClick
} from "lucide-react";
import { toast } from "react-hot-toast";
import { saveWeeklySchedule, fetchDoctorSchedule, clearSchedule } from "../../features/availability/availabilitySlice";
import { fetchMyProfile } from "../../features/doctor/doctorSlice";
import PageHeader from "../../components/ui/PageHeader";
import SectionCard from "../../components/ui/SectionCard";
import GlobalLoader from "../../components/ui/GlobalLoader";
import ErrorState from "../../components/ui/ErrorState";

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
    const theme = useTheme();
    const { weeklySchedule, isActionLoading, loading, isScheduleLoaded, workingDays } = useSelector((state) => state.availability);

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
                setError(err || "Failed to initialize clinical schedule patterns");
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
        
        if (activeDays.length === 0) {
            toast.error("Please activate at least one clinical working day");
            return;
        }

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
            toast.success("Clinical availability configured!");
        } catch (err) {
            setError(err || "Failed to commit clinical patterns");
            toast.error(err || "Failed to finalize setup");
        }
    };

    if (loading && !isScheduleLoaded) return <GlobalLoader message="Initializing clinical configuration..." />;

    const hasNoSchedule = workingDays.length === 0 && isScheduleLoaded;

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box>
                <PageHeader 
                    title="Clinical Configuration"
                    subtitle="Initialize your digital clinical presence. Configure your recurring availability and session durations for patient booking."
                    breadcrumbs={[
                        { label: "Onboarding", path: "/doctor" },
                        { label: "Schedule Setup", active: true }
                    ]}
                    action={{
                        label: isActionLoading ? "Processing..." : "Finalize Configuration",
                        icon: Sparkles,
                        onClick: handleSave,
                        disabled: isActionLoading,
                        color: 'primary'
                    }}
                />

                <Grid container spacing={4}>
                    <Grid size={{ xs: 12, lg: 8 }}>
                        {hasNoSchedule && (
                            <Alert 
                                severity="info" 
                                variant="soft"
                                icon={<Sparkles size={24} />}
                                sx={{ mb: 4, borderRadius: 4, py: 2, fontWeight: 700, border: '1px solid', borderColor: alpha(theme.palette.info.main, 0.2) }}
                            >
                                <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 0.5 }}>Welcome to your Digital Practice</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>Activate your working days below to begin receiving appointment requests. Your availability defines your platform visibility.</Typography>
                            </Alert>
                        )}

                        <SectionCard 
                            title="Availability Blueprint" 
                            subtitle="Toggle active days and define session durations"
                        >
                            <Stack spacing={2.5}>
                                {schedule.map((day, index) => (
                                    <Paper
                                        key={day.dayOfWeek}
                                        elevation={0}
                                        sx={{
                                            p: 3,
                                            borderRadius: 4,
                                            border: "1px solid",
                                            borderColor: day.isActive ? alpha(theme.palette.primary.main, 0.25) : "divider",
                                            bgcolor: day.isActive ? "white" : alpha(theme.palette.background.default, 0.4),
                                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
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
                                                    direction={{ xs: "column", md: "row" }} 
                                                    spacing={2} 
                                                    alignItems="center"
                                                    sx={{ 
                                                        opacity: day.isActive ? 1 : 0.3, 
                                                        pointerEvents: day.isActive ? "auto" : "none" 
                                                    }}
                                                >
                                                    <Box sx={{ display: 'flex', gap: 1.5, width: '100%', flexGrow: 1 }}>
                                                        <TimePicker
                                                            label="Shift Start"
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
                                                            label="Shift End"
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
                                                            minWidth: 130,
                                                            '& .MuiOutlinedInput-root': { borderRadius: 2.5 } 
                                                        }}
                                                    >
                                                        {[15, 30, 45, 60].map(m => (
                                                            <MenuItem key={m} value={m} sx={{ fontWeight: 800 }}>{m} Minutes</MenuItem>
                                                        ))}
                                                    </TextField>

                                                    <Box 
                                                        sx={{ 
                                                            display: "flex", 
                                                            alignItems: "center", 
                                                            gap: 1, 
                                                            px: 2, 
                                                            py: 0.8, 
                                                            borderRadius: 2.5, 
                                                            bgcolor: day.isActive ? alpha(theme.palette.primary.main, 0.05) : "transparent",
                                                            border: '1px solid',
                                                            borderColor: day.isActive ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                                                            color: day.isActive ? 'primary.main' : 'text.disabled',
                                                            minWidth: 110,
                                                            justifyContent: 'center'
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
                            <SectionCard title="Configuration Guide" icon={Info}>
                                <Stack spacing={3}>
                                    <Box>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1, color: 'primary.main' }}>
                                            Predictive Slot Generation
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, lineHeight: 1.6 }}>
                                            The system automatically segments your clinical shift into bookable sessions based on the selected duration.
                                        </Typography>
                                    </Box>

                                    <Divider />

                                    <Stack spacing={2.5}>
                                        {[
                                            { icon: Clock, title: 'Session Precision', desc: 'Choose a duration that matches your clinical workflow.', color: 'info' },
                                            { icon: MousePointerClick, title: 'Interactive Selection', desc: 'Toggle days on/off to reflect your real-world hours.', color: 'success' },
                                            { icon: Sparkles, title: 'Instant Visibility', desc: 'Patients can book immediately after you finalize setup.', color: 'warning' }
                                        ].map((item, i) => (
                                            <Box key={i} sx={{ display: 'flex', gap: 2 }}>
                                                <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: alpha(theme.palette[item.color].main, 0.1), color: `${item.color}.main`, height: 'fit-content' }}>
                                                    <item.icon size={18} />
                                                </Box>
                                                <Box>
                                                    <Typography variant="caption" sx={{ fontWeight: 900, display: 'block' }}>{item.title}</Typography>
                                                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>{item.desc}</Typography>
                                                </Box>
                                            </Box>
                                        ))}
                                    </Stack>

                                    {!schedule.some(d => d.isActive) && (
                                        <Box sx={{ p: 2, borderRadius: 3, bgcolor: alpha(theme.palette.error.main, 0.05), border: '1px solid', borderColor: alpha(theme.palette.error.main, 0.1) }}>
                                            <Stack direction="row" spacing={1.5}>
                                                <AlertTriangle size={18} color={theme.palette.error.main} />
                                                <Typography variant="caption" sx={{ color: 'error.main', fontWeight: 800 }}>
                                                    At least one active day is required to proceed.
                                                </Typography>
                                            </Stack>
                                        </Box>
                                    )}
                                </Stack>
                            </SectionCard>

                            <Paper 
                                elevation={0}
                                sx={{ 
                                    p: 4, 
                                    borderRadius: 4, 
                                    bgcolor: alpha(theme.palette.primary.main, 0.03),
                                    border: '1px dashed',
                                    borderColor: alpha(theme.palette.primary.main, 0.2),
                                    textAlign: 'center'
                                }}
                            >
                                <Typography variant="h3" sx={{ fontWeight: 900, color: 'primary.main', mb: 1 }}>
                                    {schedule.filter(d => d.isActive).length} / 7
                                </Typography>
                                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1.5 }}>
                                    Clinical Week Active
                                </Typography>
                            </Paper>
                        </Stack>
                    </Grid>
                </Grid>

                {error && (
                    <Alert 
                        severity="error" 
                        variant="soft"
                        sx={{ mt: 3, borderRadius: 3, fontWeight: 700 }}
                    >
                        {error}
                    </Alert>
                )}
            </Box>
        </LocalizationProvider>
    );
};

export default ScheduleSetupPage;
