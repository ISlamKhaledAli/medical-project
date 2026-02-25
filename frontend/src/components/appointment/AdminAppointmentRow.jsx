import React, { memo } from "react";
import { 
    TableRow, 
    TableCell, 
    Box, 
    Avatar, 
    Typography, 
    IconButton, 
    Tooltip,
    CircularProgress,
    Stack
} from "@mui/material";
import { 
    Visibility as ViewIcon, 
    Check as ApproveIcon, 
    Cancel as CancelIcon, 
    Delete as DeleteIcon 
} from "@mui/icons-material";
import { format } from "date-fns";
import StatusBadge from "./StatusBadge";

const AdminAppointmentRow = ({ 
    appointment, 
    onView, 
    onApprove, 
    onCancel, 
    onDelete, 
    isLoading 
}) => {
    const { status } = appointment;
    
    // Business Logic for Action Availability
    const canApprove = status?.toLowerCase() === "pending";
    const canCancel = ["pending", "approved", "confirmed"].includes(status?.toLowerCase());
    const isTerminal = ["completed", "cancelled"].includes(status?.toLowerCase());

    return (
        <TableRow hover sx={{ "&:last-child td, &:last-child th": { border: 0 }, transition: "background-color 0.2s" }}>
            <TableCell>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar 
                        sx={{ 
                            mr: 2, 
                            bgcolor: "primary.light", 
                            color: "primary.main",
                            fontWeight: 700,
                            fontSize: "0.875rem"
                        }}
                    >
                        {appointment.patient?.fullName?.[0] || "?"}
                    </Avatar>
                    <Box>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {appointment.patient?.fullName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {appointment.patient?.email}
                        </Typography>
                    </Box>
                </Box>
            </TableCell>
            <TableCell>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Dr. {appointment.doctor?.user?.fullName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    {appointment.doctor?.specialty?.name}
                </Typography>
            </TableCell>
            <TableCell>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {format(new Date(appointment.appointmentDate), "PPP")}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    {appointment.startTime} - {appointment.endTime}
                </Typography>
            </TableCell>
            <TableCell>
                <StatusBadge status={status} />
            </TableCell>
            <TableCell align="right">
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Tooltip title="View Details">
                        <IconButton size="small" onClick={() => onView(appointment)} color="info">
                            <ViewIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title={canApprove ? "Approve Appointment" : "Cannot Approve"}>
                        <span>
                            <IconButton 
                                size="small" 
                                onClick={() => onApprove(appointment._id)} 
                                color="success"
                                disabled={!canApprove || isLoading}
                            >
                                {isLoading ? <CircularProgress size={18} thickness={5} /> : <ApproveIcon fontSize="small" />}
                            </IconButton>
                        </span>
                    </Tooltip>

                    <Tooltip title={canCancel ? "Cancel Appointment" : "Cannot Cancel"}>
                        <span>
                            <IconButton 
                                size="small" 
                                onClick={() => onCancel(appointment._id)} 
                                color="warning"
                                disabled={!canCancel || isLoading}
                            >
                                <CancelIcon fontSize="small" />
                            </IconButton>
                        </span>
                    </Tooltip>

                    <Tooltip title="Delete Permanently">
                        <span>
                            <IconButton 
                                size="small" 
                                onClick={() => onDelete(appointment._id)} 
                                color="error"
                                disabled={isLoading}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </span>
                    </Tooltip>
                </Stack>
            </TableCell>
        </TableRow>
    );
};

export default memo(AdminAppointmentRow);
