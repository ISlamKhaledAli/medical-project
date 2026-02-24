import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
    Box, 
    Typography, 
    Paper, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow,
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Tabs,
    Tab,
    Stack,
    Chip,
    Avatar
} from "@mui/material";
import { 
    Check as ConfirmIcon, 
    Close as RejectIcon, 
    NoteAdd as NoteIcon,
    Visibility as ViewIcon,
    DoneAll as CompleteIcon
} from "@mui/icons-material";
import { fetchMyAppointments, updateAppointmentStatus } from "../../features/appointment/appointmentSlice";
import StatusBadge from "../../components/appointment/StatusBadge";
import { format } from "date-fns";
import TableSkeleton from "../../components/skeletons/TableSkeleton";
import EmptyState from "../../components/ui/EmptyState";

const DoctorAppointmentsPage = () => {
    const dispatch = useDispatch();
    const { appointments, isLoading } = useSelector((state) => state.appointment);
    const [tab, setTab] = useState(0);
    const [noteDialogOpen, setNoteDialogOpen] = useState(false);
    const [selectedApt, setSelectedApt] = useState(null);
    const [note, setNote] = useState("");

    useEffect(() => {
        dispatch(fetchMyAppointments());
    }, [dispatch]);

    const filteredAppointments = (appointments || []).filter(apt => {
        if (tab === 0) return ["pending", "confirmed"].includes(apt?.status);
        if (tab === 1) return ["completed", "cancelled"].includes(apt?.status);
        return true;
    });

    const handleUpdateStatus = (id, status, notes = "") => {
        dispatch(updateAppointmentStatus({ id, status, notes }));
        setNoteDialogOpen(false);
    };

    const handleOpenNoteDialog = (apt) => {
        setSelectedApt(apt);
        setNote(apt.notes || "");
        setNoteDialogOpen(true);
    };

    return (
        <Box sx={{ p: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: "#1a237e" }}>
                    Manage Appointments
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Review and update your patient visits.
                </Typography>
            </Box>

            <Tabs 
                value={tab} 
                onChange={(e, v) => setTab(v)} 
                sx={{ mb: 4, borderBottom: 1, borderColor: 'divider' }}
            >
                <Tab label={`Upcoming (${(appointments || []).filter(a => ["pending", "confirmed"].includes(a?.status)).length})`} sx={{ textTransform: "none", fontWeight: 700 }} />
                <Tab label="Past / History" sx={{ textTransform: "none", fontWeight: 700 }} />
            </Tabs>

            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, border: "1px solid rgba(0,0,0,0.05)" }}>
                <Table>
                    <TableHead sx={{ bgcolor: "rgba(0,0,0,0.01)" }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700 }}>Patient</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Date & Time</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Notes</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            <TableSkeleton rows={5} cols={5} />
                        ) : filteredAppointments.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5}>
                                    <EmptyState message="No appointments found." />
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredAppointments.map((apt) => (
                                <TableRow key={apt._id} hover>
                                    <TableCell>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Avatar sx={{ bgcolor: "primary.light", color: "primary.main" }}>
                                                {apt.patient?.fullName?.[0]}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                                    {apt.patient?.fullName}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {apt.patient?.email}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            {format(new Date(apt.appointmentDate), "PPP")}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {apt.startTime} - {apt.endTime}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge status={apt.status} />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ 
                                            maxWidth: 200, 
                                            overflow: "hidden", 
                                            textOverflow: "ellipsis", 
                                            whiteSpace: "nowrap",
                                            color: apt.notes ? "text.primary" : "text.disabled",
                                            fontStyle: apt.notes ? "normal" : "italic"
                                        }}>
                                            {apt.notes || "No notes added"}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                                            {apt.status === "pending" && (
                                                <IconButton 
                                                    color="success" 
                                                    size="small"
                                                    onClick={() => handleUpdateStatus(apt._id, "confirmed")}
                                                >
                                                    <ConfirmIcon />
                                                </IconButton>
                                            )}
                                            {apt.status === "confirmed" && (
                                                <IconButton 
                                                    color="primary" 
                                                    size="small"
                                                    onClick={() => handleUpdateStatus(apt._id, "completed")}
                                                >
                                                    <CompleteIcon />
                                                </IconButton>
                                            )}
                                            {["pending", "confirmed"].includes(apt.status) && (
                                                <IconButton 
                                                    color="error" 
                                                    size="small"
                                                    onClick={() => handleUpdateStatus(apt._id, "cancelled")}
                                                >
                                                    <RejectIcon />
                                                </IconButton>
                                            )}
                                            <IconButton 
                                                size="small"
                                                onClick={() => handleOpenNoteDialog(apt)}
                                            >
                                                <NoteIcon fontSize="small" />
                                            </IconButton>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Note Dialog */}
            <Dialog open={noteDialogOpen} onClose={() => setNoteDialogOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle sx={{ fontWeight: 800 }}>Appointment Notes</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Add medical notes or instructions for {selectedApt?.patient?.fullName}.
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        placeholder="Type notes here..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        variant="outlined"
                        sx={{ mt: 1 }}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setNoteDialogOpen(false)}>Cancel</Button>
                    <Button 
                        variant="contained" 
                        onClick={() => handleUpdateStatus(selectedApt._id, selectedApt.status, note)}
                        sx={{ fontWeight: 700 }}
                    >
                        Save Notes
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default DoctorAppointmentsPage;
