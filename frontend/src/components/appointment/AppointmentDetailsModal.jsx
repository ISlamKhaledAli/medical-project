import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Grid,
    Divider,
    Avatar,
    Chip,
    IconButton,
    Stack
} from "@mui/material";
import { 
    Close as CloseIcon, 
    Event as CalendarIcon, 
    AccessTime as TimeIcon,
    Person as PatientIcon,
    MedicalServices as DoctorIcon,
    Notes as NotesIcon
} from "@mui/icons-material";
import { format } from "date-fns";
import StatusBadge from "./StatusBadge";

const AppointmentDetailsModal = ({ open, onClose, appointment }) => {
    if (!appointment) return null;

    const details = [
        { label: "Patient", value: appointment.patient?.fullName, icon: <PatientIcon />, sub: appointment.patient?.email },
        { label: "Doctor", value: `Dr. ${appointment.doctor?.user?.fullName}`, icon: <DoctorIcon />, sub: appointment.doctor?.specialty?.name },
        { label: "Date", value: format(new Date(appointment.appointmentDate), "PPPP"), icon: <CalendarIcon /> },
        { label: "Time Slot", value: `${appointment.startTime} - ${appointment.endTime}`, icon: <TimeIcon /> },
    ];

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            maxWidth="sm" 
            fullWidth
            PaperProps={{
                sx: { borderRadius: 3, p: 1 }
            }}
        >
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>Appointment Details</Typography>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            
            <DialogContent dividers sx={{ borderBottom: "none" }}>
                <Box sx={{ mb: 3, display: "flex", justifyContent: "center" }}>
                    <StatusBadge status={appointment.status} />
                </Box>

                <Grid container spacing={3}>
                    {details.map((item, idx) => (
                        <Grid item xs={12} key={idx}>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Avatar sx={{ bgcolor: "rgba(0,0,0,0.04)", color: "primary.main", mr: 2 }}>
                                    {item.icon}
                                </Avatar>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", fontWeight: 700 }}>
                                        {item.label}
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 700 }}>
                                        {item.value}
                                    </Typography>
                                    {item.sub && (
                                        <Typography variant="body2" color="text.secondary">
                                            {item.sub}
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                        </Grid>
                    ))}

                    <Grid item xs={12}>
                        <Divider sx={{ my: 1 }} />
                        <Box sx={{ display: "flex", alignItems: "flex-start", mt: 1 }}>
                            <Avatar sx={{ bgcolor: "rgba(0,0,0,0.04)", color: "primary.main", mr: 2 }}>
                                <NotesIcon />
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", fontWeight: 700 }}>
                                    Admin/Internal Notes
                                </Typography>
                                <Typography variant="body2" sx={{ fontStyle: "italic", color: "text.secondary", mt: 0.5 }}>
                                    {appointment.notes || "No notes provided for this appointment."}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 3 }}>
                <Button 
                    onClick={onClose} 
                    variant="contained" 
                    fullWidth 
                    sx={{ borderRadius: 2, height: 45, fontWeight: 700, textTransform: "none" }}
                >
                    Close Details
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AppointmentDetailsModal;
