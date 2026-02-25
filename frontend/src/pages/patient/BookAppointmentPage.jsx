import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
    CircularProgress
} from "@mui/material";
import { 
    CalendarMonth as CalendarIcon, 
    CheckCircle as SuccessIcon,
    ArrowBack as BackIcon
} from "@mui/icons-material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format, isBefore, startOfDay } from "date-fns";

import { fetchDoctorById } from "../../features/doctor/doctorSlice";
import { fetchDoctorAvailability, clearSlots } from "../../features/availability/availabilitySlice";
import { createAppointment, clearAppointmentError } from "../../features/appointment/appointmentSlice";
import AvailabilitySlots from "../../components/appointment/AvailabilitySlots";

const steps = ["Select Date", "Choose Time", "Confirm Booking"];

const BookAppointmentPage = () => {
    const { doctorId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const { doctorDetails: doctor, isLoading: isDoctorLoading } = useSelector((state) => state.doctor);
    const { slots, isLoading: isSlotsLoading, error: slotsError } = useSelector((state) => state.availability);
    const { isActionLoading, error: bookingError } = useSelector((state) => state.appointment);

    const [activeStep, setActiveStep] = useState(0);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedSlot, setSelectedSlot] = useState(null);

    useEffect(() => {
        if (doctorId) {
            dispatch(fetchDoctorById(doctorId));
        }
        return () => {
            dispatch(clearSlots());
            dispatch(clearAppointmentError());
        };
    }, [dispatch, doctorId]);

    // Fetch slots when date changes
    useEffect(() => {
        if (doctorId && selectedDate) {
            dispatch(fetchDoctorAvailability({ 
                doctorId, 
                date: format(selectedDate, "yyyy-MM-dd") 
            }));
            setSelectedSlot(null); // Reset slot on date change
        }
    }, [dispatch, doctorId, selectedDate]);

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

    const handleBook = async () => {
        const appointmentData = {
            doctorId,
            appointmentDate: format(selectedDate, "yyyy-MM-dd"), // Backend uses appointmentDate
            startTime: selectedSlot.startTime,
            endTime: selectedSlot.endTime
        };
        const result = await dispatch(createAppointment(appointmentData));
        if (createAppointment.fulfilled.match(result)) {
            setActiveStep(3); // Success step
        }
    };

    if (isDoctorLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    if (activeStep === 3) {
        return (
            <Container maxWidth="sm" sx={{ py: 10 }}>
                <Paper elevation={0} sx={{ p: 6, borderRadius: 4, textAlign: "center", border: "1px solid rgba(0,0,0,0.05)" }}>
                    <SuccessIcon color="success" sx={{ fontSize: "5rem", mb: 3 }} />
                    <Typography variant="h4" sx={{ fontWeight: 900, mb: 2 }}>Booking Confirmed!</Typography>
                    <Typography color="text.secondary" sx={{ mb: 4 }}>
                        Your appointment with Dr. {doctor.user?.fullName || doctor.user?.name} on {format(selectedDate, "PPP")} at {selectedSlot?.startTime} has been successfully scheduled.
                    </Typography>
                    <Button variant="contained" size="large" onClick={() => navigate("/patient/appointments")} sx={{ borderRadius: 3, fontWeight: 700 }}>
                        View My Appointments
                    </Button>
                </Paper>
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
                Back
            </Button>

            <Typography variant="h4" sx={{ fontWeight: 900, color: "#1a237e", mb: 4 }}>
                Book Appointment
            </Typography>

            <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: "1px solid rgba(0,0,0,0.05)" }}>
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

                <Box sx={{ minHeight: 300 }}>
                    {activeStep === 0 && (
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>When would you like to visit?</Typography>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Select Appointment Date"
                                    value={selectedDate}
                                    onChange={(newValue) => setSelectedDate(newValue)}
                                    shouldDisableDate={(date) => isBefore(date, startOfDay(new Date()))}
                                    slotProps={{ textField: { fullWidth: true, sx: { borderRadius: 3 } } }}
                                />
                            </LocalizationProvider>
                            <Box sx={{ mt: 3, p: 2, bgcolor: "rgba(25, 118, 210, 0.05)", borderRadius: 3 }}>
                                <Typography variant="body2" color="primary" sx={{ fontWeight: 700 }}>
                                    <CalendarIcon sx={{ fontSize: "1rem", mr: 1, verticalAlign: "middle" }} />
                                    Selected: {format(selectedDate, "PPP")}
                                </Typography>
                            </Box>
                        </Box>
                    )}

                    {activeStep === 1 && (
                        <AvailabilitySlots 
                            slots={slots} 
                            selectedSlot={selectedSlot} 
                            onSelect={setSelectedSlot} 
                            isLoading={isSlotsLoading} 
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
                                    <Typography sx={{ fontWeight: 700 }}>{format(selectedDate, "PPP")}</Typography>
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
