import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
    Box, 
    Typography, 
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
    Avatar,
    alpha,
    useTheme,
    Tooltip,
    InputAdornment
} from "@mui/material";
import { 
    CheckCircle2, 
    XCircle, 
    FileText,
    Eye,
    Check,
    Search,
    Calendar,
    Clock,
    MoreVertical,
    Activity,
    MessageSquare
} from "lucide-react";
import { fetchMyAppointments, updateAppointmentStatus } from "../../features/appointment/appointmentSlice";
import StatusBadge from "../../components/appointment/StatusBadge";
import { format, parseISO } from "date-fns";
import TableSkeleton from "../../components/skeletons/TableSkeleton";
import EmptyState from "../../components/ui/EmptyState";
import PageHeader from "../../components/ui/PageHeader";
import SectionCard from "../../components/ui/SectionCard";
import toast from "react-hot-toast";

const DoctorAppointmentsPage = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const { appointments, isLoading } = useSelector((state) => state.appointment);
    const [tab, setTab] = useState(0);
    const [noteDialogOpen, setNoteDialogOpen] = useState(false);
    const [selectedApt, setSelectedApt] = useState(null);
    const [note, setNote] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        dispatch(fetchMyAppointments());
    }, [dispatch]);

    const filteredAppointments = useMemo(() => {
        let base = (appointments || []);
        if (tab === 0) base = base.filter(apt => ["pending", "confirmed"].includes(apt?.status));
        else if (tab === 1) base = base.filter(apt => ["completed", "cancelled"].includes(apt?.status));
        
        if (!searchQuery) return base;
        return base.filter(apt => 
            apt.patient?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            apt.patient?.email?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [appointments, tab, searchQuery]);

    const handleUpdateStatus = async (id, status, notes = "") => {
        try {
            await dispatch(updateAppointmentStatus({ id, status, notes })).unwrap();
            toast.success(notes ? "Clinical notes updated" : `Status updated to ${status}`);
            dispatch(fetchMyAppointments());
        } catch (err) {
            toast.error(err || "Failed to update record");
        }
        setNoteDialogOpen(false);
    };

    const handleOpenNoteDialog = (apt) => {
        setSelectedApt(apt);
        setNote(apt.doctorNotes || "");
        setNoteDialogOpen(true);
    };

    return (
        <Box>
            <PageHeader 
                title="Clinical Queue"
                subtitle="Manage your patient throughput. Review pending requests, confirm schedules, and maintain session notes."
                breadcrumbs={[
                    { label: "Doctor", path: "/doctor" },
                    { label: "Appointments", active: true }
                ]}
            />

            <Box sx={{ mb: 4 }}>
                <Tabs 
                    value={tab} 
                    onChange={(e, v) => setTab(v)} 
                    sx={{ 
                        '& .MuiTabs-indicator': { height: 3, borderRadius: '3px 3px 0 0' },
                        '& .MuiTab-root': { textTransform: 'none', fontWeight: 800, fontSize: '0.95rem', minWidth: 160 }
                    }}
                >
                    <Tab label={`Upcoming (${(appointments || []).filter(a => ["pending", "confirmed"].includes(a?.status)).length})`} />
                    <Tab label="Past Registry" />
                </Tabs>
            </Box>

            {isLoading ? (
                <TableSkeleton rows={8} cols={5} />
            ) : filteredAppointments.length === 0 ? (
                <SectionCard 
                    title={tab === 0 ? "Upcoming Consultations" : "Historical Records"}
                    subtitle={`${filteredAppointments.length} sessions identified in current scope`}
                    headerAction={
                        <TextField 
                            placeholder="Search patient identity..."
                            size="small"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            sx={{ 
                                minWidth: 280,
                                '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: alpha(theme.palette.background.default, 0.5) }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search size={18} color={theme.palette.text.disabled} />
                                    </InputAdornment>
                                )
                            }}
                        />
                    }
                >
                    <Box sx={{ py: 6 }}>
                        <EmptyState 
                            title="Queue Empty"
                            message="No sessions found for this category."
                            icon={Calendar}
                        />
                    </Box>
                </SectionCard>
            ) : (
                <SectionCard 
                    title={tab === 0 ? "Upcoming Consultations" : "Historical Records"}
                    subtitle={`${filteredAppointments.length} sessions identified in current scope`}
                    headerAction={
                        <TextField 
                            placeholder="Search patient identity..."
                            size="small"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            sx={{ 
                                minWidth: 280,
                                '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: alpha(theme.palette.background.default, 0.5) }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search size={18} color={theme.palette.text.disabled} />
                                    </InputAdornment>
                                )
                            }}
                        />
                    }
                >
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 800, color: "text.secondary", pl: 0 }}>Patient Identity</TableCell>
                                    <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>Schedule</TableCell>
                                    <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>Current State</TableCell>
                                    <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>Clinical Notes</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 800, color: "text.secondary", pr: 0 }}>Management</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredAppointments.map((apt) => (
                                    <TableRow key={apt._id} hover sx={{ '&:last-child td': { border: 0 } }}>
                                        <TableCell sx={{ py: 2.5, pl: 0 }}>
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Avatar 
                                                    sx={{ 
                                                        width: 44, 
                                                        height: 44, 
                                                        borderRadius: 2.5,
                                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                        color: "primary.main",
                                                        fontWeight: 800
                                                    }}
                                                >
                                                    {apt.patient?.fullName?.[0] || "P"}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                                                        {apt.patient?.fullName}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                                                        {apt.patient?.email}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            <Stack spacing={0.5}>
                                                <Typography variant="body2" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Calendar size={14} color={theme.palette.primary.main} />
                                                    {apt.appointmentDate ? format(parseISO(apt.appointmentDate), "MMM dd, yyyy") : "N/A"}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600 }}>
                                                    <Clock size={14} />
                                                    {apt.startTime} - {apt.endTime}
                                                </Typography>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            <StatusBadge status={apt.status} />
                                        </TableCell>
                                        <TableCell>
                                            <Box 
                                                sx={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    gap: 1.5,
                                                    maxWidth: 240, 
                                                    p: 1.5,
                                                    borderRadius: 2,
                                                    bgcolor: apt.doctorNotes ? alpha(theme.palette.info.main, 0.04) : alpha(theme.palette.text.disabled, 0.05),
                                                    border: '1px solid',
                                                    borderColor: apt.doctorNotes ? alpha(theme.palette.info.main, 0.1) : 'transparent'
                                                }}
                                            >
                                                <FileText size={16} color={apt.doctorNotes ? theme.palette.info.main : theme.palette.text.disabled} />
                                                <Typography variant="caption" sx={{ 
                                                    overflow: "hidden", 
                                                    textOverflow: "ellipsis", 
                                                    whiteSpace: "nowrap",
                                                    fontWeight: 600,
                                                    color: apt.doctorNotes ? "text.primary" : "text.disabled"
                                                }}>
                                                    {apt.doctorNotes || "Empty narrative"}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="right" sx={{ pr: 0 }}>
                                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                {apt.status === "pending" && (
                                                    <Tooltip title="Confirm Session">
                                                        <IconButton 
                                                            onClick={() => handleUpdateStatus(apt._id, "confirmed")}
                                                            sx={{ borderRadius: 2, bgcolor: alpha(theme.palette.success.main, 0.05), color: 'success.main' }}
                                                        >
                                                            <Check size={18} />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                                {apt.status === "confirmed" && (
                                                    <Tooltip title="Complete Session">
                                                        <IconButton 
                                                            onClick={() => handleUpdateStatus(apt._id, "completed")}
                                                            sx={{ borderRadius: 2, bgcolor: alpha(theme.palette.success.main, 0.05), color: 'success.main' }}
                                                        >
                                                            <CheckCircle2 size={18} />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                                {["pending", "confirmed"].includes(apt.status) && (
                                                    <Tooltip title="Cancel Session">
                                                        <IconButton 
                                                            onClick={() => handleUpdateStatus(apt._id, "cancelled")}
                                                            sx={{ borderRadius: 2, bgcolor: alpha(theme.palette.error.main, 0.05), color: 'error.main' }}
                                                        >
                                                            <XCircle size={18} />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                                <Tooltip title="Clinical Notes">
                                                    <IconButton 
                                                        onClick={() => handleOpenNoteDialog(apt)}
                                                        sx={{ borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), color: 'primary.main' }}
                                                    >
                                                        <MessageSquare size={18} />
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </SectionCard>
            )}

            <Dialog open={noteDialogOpen} onClose={() => setNoteDialogOpen(false)} PaperProps={{ sx: { borderRadius: 4, width: '100%', maxWidth: 500 } }}>
                <DialogTitle sx={{ p: 3, pb: 1, fontWeight: 900 }}>Clinical Narrative</DialogTitle>
                <DialogContent sx={{ px: 3 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, fontWeight: 500 }}>
                        Add medical observations or follow-up instructions for <strong>{selectedApt?.patient?.fullName}</strong>.
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={5}
                        placeholder="Enter persistent clinical notes..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        variant="outlined"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 1 }}>
                    <Button onClick={() => setNoteDialogOpen(false)} sx={{ fontWeight: 800, color: 'text.secondary' }}>Dismiss</Button>
                    <Button 
                        variant="contained" 
                        onClick={() => handleUpdateStatus(selectedApt._id, selectedApt.status, note)}
                        sx={{ fontWeight: 800, px: 3, borderRadius: 2.5 }}
                    >
                        Commit Notes
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default DoctorAppointmentsPage;
