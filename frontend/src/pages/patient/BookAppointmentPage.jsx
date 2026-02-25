import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
    Container, 
    Paper, 
    Box, 
    Typography, 
    Stepper, 
    Step, 
    StepLabel, 
    Button, 
    Divider,
    Alert,
    CircularProgress,
    Stack
} from "@mui/material";
import { 
    CalendarMonth as CalendarIcon, 
    CheckCircle as SuccessIcon,
    ArrowBack as BackIcon,
    Info as InfoIcon
} from "@mui/icons-material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format, isBefore, startOfDay } from "date-fns";

import { fetchDoctorById } from "../../features/doctor/doctorSlice";
import { fetchDoctorSchedule, clearSchedule } from "../../features/availability/availabilitySlice";
import { createAppointment, rescheduleAppointment, clearAppointmentError } from "../../features/appointment/appointmentSlice";
import AvailabilitySlots from "../../components/appointment/AvailabilitySlots";

const steps = ["Select Date", "Choose Time", "Confirm Booking"];

/**
 * Page for patients to book or reschedule an appointment
 */
const BookAppointmentPage = () => {
    const { doctorId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    
    // Reschedule Mode Detection
    const rescheduleId = location.state?.rescheduleId;
    const isReschedule = !!rescheduleId;
    
    const { doctorDetails: doctor, isLoading: isDoctorLoading } = useSelector((state) => state.doctor);
    const { slots, workingDays, isScheduleLoaded, isLoading: isAvailabilityLoading, error: slotsError } = useSelector((state) => state.availability);
    const { isActionLoading, error: bookingError } = useSelector((state) => state.appointment);

    const [activeStep, setActiveStep] = useState(0);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [isDateSelectionInitial, setIsDateSelectionInitial] = useState(true);

    const isValidId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

    // 1. Initial Load: Fetch doctor details and their general weekly schedule
    useEffect(() => {
        if (doctorId && isValidId(doctorId)) {
            dispatch(fetchDoctorById(doctorId));
            // Fetch working days on mount
            dispatch(fetchDoctorSchedule({ 
                doctorId, 
                excludeAppointmentId: rescheduleId 
            }));
        } else if (doctorId) {
            console.error("Malformed or invalid doctorId in URL:", doctorId);
        }

        return () => {
            dispatch(clearSchedule());
            dispatch(clearAppointmentError());
        };
    }, [dispatch, doctorId]);

    // 2. Auto-select first available date logic (Runs once when schedule loads)
    useEffect(() => {
        if (isScheduleLoaded && workingDays.length > 0 && isDateSelectionInitial) {
            const findFirstAvailableDate = () => {
                let current = startOfDay(new Date());
                // Look ahead up to 30 days
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

    // 3. Fetch specific slots when date selection changes
    useEffect(() => {
        if (doctorId && selectedDate && isScheduleLoaded) {
            try {
                dispatch(fetchDoctorSchedule({ 
                    doctorId, 
                    date: selectedDate.toLocaleDateString("en-CA"),
                    excludeAppointmentId: rescheduleId
                }));
            } catch (err) {
                console.error("Error formatting date for schedule fetch:", err);
            }
            setSelectedSlot(null);
        }
    }, [dispatch, doctorId, selectedDate, isScheduleLoaded]);

    const handleNext = () => {
        if (activeStep === 2) {
            if (!selectedSlot) return;
            handleBook();
        } else {
            setActiveStep((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    /**
     * Restriction logic for the calendar.
     */
    const isDayDisabled = (date) => {
        if (!date) return true;
        const isPast = isBefore(startOfDay(date), startOfDay(new Date()));
        if (isPast) return true;
        
        if (!isScheduleLoaded) return true;
        if (!workingDays || workingDays.length === 0) return true;
        
        const dayOfWeek = date.getDay();
        return !workingDays.includes(dayOfWeek);
    };

    const handleBook = async () => {
        if (!selectedSlot || !selectedDate) return;
        
        const appointmentData = {
            doctorId,
            appointmentDate: selectedDate.toLocaleDateString("en-CA"),
            startTime: selectedSlot.startTime,
        };

        if (isReschedule) {
            const result = await dispatch(rescheduleAppointment({ 
                id: rescheduleId, 
                data: appointmentData 
            }));
            if (rescheduleAppointment.fulfilled.match(result)) {
                navigate("/patient/appointments", { 
                    state: { successMessage: "Appointment rescheduled successfully!" } 
                });
            }
        } else {
            const result = await dispatch(createAppointment(appointmentData));
            if (createAppointment.fulfilled.match(result)) {
                navigate("/patient/appointments", { 
                    state: { successMessage: "Appointment booked successfully!" } 
                });
            }
        }
    };

    if (isDoctorLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!doctor) {
        return (
            <Container sx={{ py: 10 }}>
                <Alert severity="error">Doctor profile not found.</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Button 
                startIcon={<BackIcon />} 
                onClick={() => navigate(-1)}
                sx={{ mb: 4, textTransform: "none", fontWeight: 700, color: "text.secondary" }}
            >
                Back to Listing
            </Button>

            <Typography variant="h4" sx={{ fontWeight: 900, color: "#1a237e", mb: 4 }}>
                {isReschedule ? "Reschedule Appointment" : "Book Appointment"}
            </Typography>

            <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: "1px solid rgba(0,0,0,0.05)" }}>
                {isReschedule && (
                    <Alert 
                        icon={<InfoIcon fontSize="inherit" />} 
                        severity="info" 
                        sx={{ mb: 4, borderRadius: 3, fontWeight: 700 }}
                    >
                        You are rescheduling your appointment with Dr. {doctor.user?.fullName}.
                    </Alert>
                )}

                <Stepper activeStep={activeStep} sx={{ mb: 6 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                {bookingError && (
                    <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
                        {bookingError}
                    </Alert>
                )}

                <Box sx={{ minHeight: 400 }}>
                    {activeStep === 0 && (
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>When would you like to visit?</Typography>
                            
                            {isAvailabilityLoading && !isScheduleLoaded ? (
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center", py: 5 }}>
                                    <CircularProgress size={40} />
                                    <Typography variant="body2" color="text.secondary">
                                        Loading available dates...
                                    </Typography>
                                </Box>
                            ) : (
                                <>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            label="Select Appointment Date"
                                            value={selectedDate}
                                            onChange={(newValue) => setSelectedDate(newValue)}
                                            shouldDisableDate={isDayDisabled}
                                            slotProps={{ 
                                                textField: { 
                                                    fullWidth: true, 
                                                    sx: { borderRadius: 3 },
                                                    helperText: !isScheduleLoaded ? "Fetching schedule..." : ""
                                                } 
                                            }}
                                        />
                                    </LocalizationProvider>
                                    
                                    <Box sx={{ mt: 3, p: 2, bgcolor: isScheduleLoaded && workingDays.length === 0 ? "rgba(211, 47, 47, 0.05)" : "rgba(25, 118, 210, 0.05)", borderRadius: 3 }}>
                                        <Typography variant="body2" color={isScheduleLoaded && workingDays.length === 0 ? "error" : "primary"} sx={{ fontWeight: 700 }}>
                                            <CalendarIcon sx={{ fontSize: "1rem", mr: 1, verticalAlign: "middle" }} />
                                            {!isScheduleLoaded ? (
                                                "Fetching doctor availability..."
                                            ) : workingDays.length === 0 ? (
                                                "This doctor has not set their schedule yet."
                                            ) : (
                                                `Selected: ${format(selectedDate, "PPPP")}`
                                            )}
                                        </Typography>
                                    </Box>

                                    {isScheduleLoaded && workingDays.length > 0 && (
                                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                                            * Weekends or dates where the doctor is unavailable are disabled.
                                        </Typography>
                                    )}
                                </>
                            )}
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
                        <Box sx={{ textAlign: "center" }}>
                            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Review Your Booking</Typography>
                            <Box sx={{ p: 4, bgcolor: "rgba(0,0,0,0.02)", borderRadius: 4, border: "1px dashed rgba(0,0,0,0.1)", textAlign: "left" }}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                                    <Typography color="text.secondary">Doctor</Typography>
                                    <Typography sx={{ fontWeight: 700 }}>Dr. {doctor.user?.fullName || doctor.user?.name}</Typography>
                                </Box>
                                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                                    <Typography color="text.secondary">Specialty</Typography>
                                    <Typography sx={{ fontWeight: 700 }}>{doctor.specialty?.name || doctor.specialty}</Typography>
                                </Box>
                                <Divider sx={{ my: 2 }} />
                                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                                    <Typography color="text.secondary">Date</Typography>
                                    <Typography sx={{ fontWeight: 700 }}>{format(selectedDate, "PPPP")}</Typography>
                                </Box>
                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography color="text.secondary">Time</Typography>
                                    <Typography sx={{ fontWeight: 700 }}>{selectedSlot?.startTime}</Typography>
                                </Box>
                            </Box>
                        </Box>
                    )}
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 6 }}>
                    <Button
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        sx={{ fontWeight: 700 }}
                    >
                        Back
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleNext}
                        disabled={
                            (activeStep === 0 && (!isScheduleLoaded || workingDays.length === 0)) ||
                            (activeStep === 1 && !selectedSlot) || 
                            isActionLoading
                        }
                        sx={{ borderRadius: 2, px: 4, fontWeight: 700 }}
                    >
                        {isActionLoading ? <CircularProgress size={24} color="inherit" /> : activeStep === 2 ? "Confirm & Book" : "Next"}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default BookAppointmentPage;
