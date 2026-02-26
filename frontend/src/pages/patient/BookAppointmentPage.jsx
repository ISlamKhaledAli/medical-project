import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
    Box, 
    Typography, 
    Stepper, 
    Step, 
    StepLabel, 
    Button, 
    Divider,
    Alert,
    Stack,
    Avatar,
    alpha,
    useTheme,
    Paper,
    Grid
} from "@mui/material";
import { 
    Calendar, 
    Clock, 
    CheckCircle2,
    ArrowLeft,
    Info,
    ChevronRight,
    User,
    Award,
    MapPin,
    CalendarCheck
} from "lucide-react";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format, isBefore, startOfDay, parseISO } from "date-fns";

import { fetchDoctorById } from "../../features/doctor/doctorSlice";
import { fetchDoctorSchedule, clearSchedule } from "../../features/availability/availabilitySlice";
import { createAppointment, rescheduleAppointment, clearAppointmentError } from "../../features/appointment/appointmentSlice";
import AvailabilitySlots from "../../components/appointment/AvailabilitySlots";
import PageHeader from "../../components/ui/PageHeader";
import SectionCard from "../../components/ui/SectionCard";
import GlobalLoader from "../../components/ui/GlobalLoader";

const steps = ["Select Date", "Choose Time", "Review & Confirm"];

const BookAppointmentPage = () => {
    const { doctorId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const theme = useTheme();
    
    const rescheduleId = location.state?.rescheduleId;
    const isReschedule = !!rescheduleId;
    
    const { doctorDetails: doctor, isLoading: isDoctorLoading } = useSelector((state) => state.doctor);
    const { slots, workingDays, isScheduleLoaded, isLoading: isAvailabilityLoading, error: slotsError } = useSelector((state) => state.availability);
    const { isActionLoading, error: bookingError } = useSelector((state) => state.appointment);

    const [activeStep, setActiveStep] = useState(0);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [isDateSelectionInitial, setIsDateSelectionInitial] = useState(true);

    useEffect(() => {
        if (doctorId) {
            dispatch(fetchDoctorById(doctorId));
            dispatch(fetchDoctorSchedule({ 
                doctorId, 
                excludeAppointmentId: rescheduleId 
            }));
        }

        return () => {
            dispatch(clearSchedule());
            dispatch(clearAppointmentError());
        };
    }, [dispatch, doctorId, rescheduleId]);

    useEffect(() => {
        if (isScheduleLoaded && workingDays.length > 0 && isDateSelectionInitial) {
            const findFirstAvailableDate = () => {
                let current = startOfDay(new Date());
                for (let i = 0; i < 30; i++) {
                    const dayOfWeek = current.getDay();
                    if (workingDays.includes(dayOfWeek)) {
                        return current;
                    }
                    current = new Date(current.setDate(current.getDate() + 1));
                }
                return null;
            };

            const firstDate = findFirstAvailableDate();
            if (firstDate) {
                setSelectedDate(firstDate);
            }
            setIsDateSelectionInitial(false);
        }
    }, [isScheduleLoaded, workingDays, isDateSelectionInitial]);

    useEffect(() => {
        if (doctorId && selectedDate && isScheduleLoaded) {
            dispatch(fetchDoctorSchedule({ 
                doctorId, 
                date: selectedDate.toLocaleDateString("en-CA"),
                excludeAppointmentId: rescheduleId
            }));
            setSelectedSlot(null);
        }
    }, [dispatch, doctorId, selectedDate, isScheduleLoaded, rescheduleId]);

    const handleNext = () => {
        if (activeStep === 2) {
            handleBook();
        } else {
            setActiveStep((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    const isDayDisabled = (date) => {
        if (!date) return true;
        const isPast = isBefore(startOfDay(date), startOfDay(new Date()));
        if (isPast) return true;
        if (!isScheduleLoaded || !workingDays || workingDays.length === 0) return true;
        return !workingDays.includes(date.getDay());
    };

    const handleBook = async () => {
        if (!selectedSlot || !selectedDate) return;
        
        const appointmentData = {
            doctorId,
            appointmentDate: selectedDate.toLocaleDateString("en-CA"),
            startTime: selectedSlot.startTime,
        };

        if (isReschedule) {
            const result = await dispatch(rescheduleAppointment({ id: rescheduleId, data: appointmentData }));
            if (rescheduleAppointment.fulfilled.match(result)) {
                navigate("/patient/appointments", { state: { successMessage: "Rescheduled successfully!" } });
            }
        } else {
            const result = await dispatch(createAppointment(appointmentData));
            if (createAppointment.fulfilled.match(result)) {
                navigate("/patient/appointments", { state: { successMessage: "Booked successfully!" } });
            }
        }
    };

    if (isDoctorLoading) return <GlobalLoader message="Preparing booking terminal..." />;

    if (!doctor) return <Box sx={{ p: 4 }}><Alert severity="error">Specialist profile unreachable.</Alert></Box>;

    return (
        <Box>
            <PageHeader 
                title={isReschedule ? "Reschedule Visit" : "Book New Appointment"}
                subtitle="Complete the steps below to secure your consultation time."
                breadcrumbs={[
                    { label: "Doctors", path: "/patient/doctors" },
                    { label: "Booking", active: true }
                ]}
            />

            <Grid container spacing={4}>
                {/* Left side: Doctor Profile Preview */}
                <Grid item xs={12} lg={4}>
                    <SectionCard title="Doctor Preview">
                        <Stack spacing={3}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Avatar 
                                    src={doctor.user?.profileImage}
                                    variant="rounded"
                                    sx={{ width: 64, height: 64, borderRadius: 2.5, bgcolor: "primary.main" }}
                                >
                                    {doctor.user?.fullName?.[0]}
                                </Avatar>
                                <Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
                                        Dr. {doctor.user?.fullName}
                                    </Typography>
                                    <Typography variant="caption" sx={{ fontWeight: 800, color: "primary.main", textTransform: 'uppercase' }}>
                                        {doctor.specialty?.name || "Specialist"}
                                    </Typography>
                                </Box>
                            </Stack>

                            <Stack spacing={1.5}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'text.secondary' }}>
                                    <Award size={18} />
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{doctor.experienceYears || "8+"} Years Experience</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'text.secondary' }}>
                                    <MapPin size={18} />
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{doctor.hospitalName || "City Medical Center"}</Typography>
                                </Box>
                            </Stack>

                            {selectedSlot && (
                                <Box 
                                    sx={{ 
                                        p: 2, 
                                        borderRadius: 3, 
                                        bgcolor: alpha(theme.palette.success.main, 0.05),
                                        border: "1px dashed",
                                        borderColor: alpha(theme.palette.success.main, 0.2)
                                    }}
                                >
                                    <Typography variant="caption" sx={{ fontWeight: 800, color: "success.main", textTransform: 'uppercase', mb: 1, display: 'block' }}>
                                        Selected Slot
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Calendar size={14} /> {format(selectedDate, "MMM dd, yyyy")}
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Clock size={14} /> {selectedSlot.startTime}
                                    </Typography>
                                </Box>
                            )}

                            <Paper 
                                elevation={0}
                                sx={{ 
                                    p: 2, 
                                    borderRadius: 3, 
                                    bgcolor: alpha(theme.palette.info.main, 0.05),
                                    border: "1px solid",
                                    borderColor: alpha(theme.palette.info.main, 0.1)
                                }}
                            >
                                <Stack direction="row" spacing={1.5}>
                                    <Info size={20} color={theme.palette.info.main} />
                                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, lineHeight: 1.5 }}>
                                        Cancellation is free up to 24 hours before the appointment.
                                    </Typography>
                                </Stack>
                            </Paper>
                        </Stack>
                    </SectionCard>
                </Grid>

                {/* Right side: Multi-step booking */}
                <Grid item xs={12} lg={8}>
                    <SectionCard sx={{ minHeight: 600, display: 'flex', flexDirection: 'column' }}>
                        <Stepper activeStep={activeStep} sx={{ mb: 6, px: { xs: 0, md: 4 } }}>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel 
                                        StepIconProps={{
                                            sx: { '&.Mui-active': { color: 'primary.main' }, '&.Mui-completed': { color: 'success.main' } }
                                        }}
                                    >
                                        <Typography variant="caption" sx={{ fontWeight: 800 }}>{label}</Typography>
                                    </StepLabel>
                                </Step>
                            ))}
                        </Stepper>

                        <Box sx={{ flexGrow: 1 }}>
                            {bookingError && <Alert severity="error" variant="soft" sx={{ mb: 4, borderRadius: 2.5, fontWeight: 700 }}>{bookingError}</Alert>}

                            {activeStep === 0 && (
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 900, mb: 1 }}>Choose a date</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 4, fontWeight: 500 }}>
                                        Select an available date for your consultation. Regular weekends are pre-filtered.
                                    </Typography>
                                    
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            value={selectedDate}
                                            onChange={(newValue) => setSelectedDate(newValue)}
                                            shouldDisableDate={isDayDisabled}
                                            slotProps={{ 
                                                textField: { 
                                                    fullWidth: true, 
                                                    variant: 'outlined',
                                                    sx: { 
                                                        '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: alpha(theme.palette.background.default, 0.5) } 
                                                    }
                                                } 
                                            }}
                                        />
                                    </LocalizationProvider>

                                    <Box sx={{ mt: 4, p: 3, borderRadius: 4, bgcolor: alpha(theme.palette.primary.main, 0.03), border: '1px solid', borderColor: alpha(theme.palette.primary.main, 0.1) }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                            <CalendarCheck size={18} /> Available Working Days
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                            {!isScheduleLoaded ? "Loading schedule..." : workingDays.length === 0 ? "No active schedule found for this doctor." : `This doctor is active ${workingDays.length} days a week.`}
                                        </Typography>
                                    </Box>
                                </Box>
                            )}

                            {activeStep === 1 && (
                                <AvailabilitySlots 
                                    slots={slots} 
                                    selectedSlot={selectedSlot} 
                                    onSelect={setSelectedSlot} 
                                    isLoading={isAvailabilityLoading} 
                                />
                            )}

                            {activeStep === 2 && (
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 900, mb: 1 }}>Ready to confirm?</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 4, fontWeight: 500 }}>
                                        Please review the details below before finalizing your booking.
                                    </Typography>
                                    
                                    <Box 
                                        sx={{ 
                                            p: 4, 
                                            borderRadius: 4, 
                                            bgcolor: alpha(theme.palette.background.default, 0.8), 
                                            border: '1px solid', 
                                            borderColor: 'divider',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                                        }}
                                    >
                                        <Stack spacing={3}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>Service Type</Typography>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Medical Consultation</Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>Professional</Typography>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Dr. {doctor.user?.fullName}</Typography>
                                            </Box>
                                            <Divider />
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>Date</Typography>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main' }}>{format(selectedDate, "PPPP")}</Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>Start Time</Typography>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main' }}>{selectedSlot?.startTime}</Typography>
                                            </Box>
                                        </Stack>
                                    </Box>

                                    <Box sx={{ mt: 4, display: 'flex', gap: 2, p: 2, borderRadius: 3, bgcolor: alpha(theme.palette.warning.main, 0.05) }}>
                                        <CheckCircle2 size={24} color={theme.palette.success.main} />
                                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, lineHeight: 1.5 }}>
                                            By confirming, you agree to the clinic's terms of service and patient privacy policy.
                                        </Typography>
                                    </Box>
                                </Box>
                            )}
                        </Box>

                        <Stack direction="row" justifyContent="space-between" sx={{ mt: 6 }}>
                            <Button
                                startIcon={<ArrowLeft size={18} />}
                                disabled={activeStep === 0}
                                onClick={handleBack}
                                sx={{ fontWeight: 800, textTransform: 'none', color: 'text.secondary', px: 3 }}
                            >
                                Back
                            </Button>
                            
                            <Button
                                variant="contained"
                                endIcon={activeStep === 2 ? <CheckCircle2 size={18} /> : <ChevronRight size={18} />}
                                onClick={handleNext}
                                disabled={
                                    (activeStep === 0 && (!isScheduleLoaded || workingDays.length === 0)) ||
                                    (activeStep === 1 && !selectedSlot) || 
                                    isActionLoading
                                }
                                sx={{ 
                                    borderRadius: 3, 
                                    px: 5, 
                                    py: 1.5,
                                    fontWeight: 900, 
                                    textTransform: 'none',
                                    boxShadow: activeStep === 2 ? `0 8px 16px ${alpha(theme.palette.primary.main, 0.2)}` : 0
                                }}
                            >
                                {isActionLoading ? "Processing..." : activeStep === 2 ? "Confirm Booking" : "Continue"}
                            </Button>
                        </Stack>
                    </SectionCard>
                </Grid>
            </Grid>
        </Box>
    );
};

export default BookAppointmentPage;
