import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Typography,
    Box,
    Grid,
    Chip,
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    Snackbar,
    Stack,
    Tooltip,
    alpha,
    useTheme,
    InputAdornment
} from "@mui/material";
import {
    Trash2,
    Edit2,
    Plus,
    Stethoscope,
    Search,
    ShieldCheck,
    AlertTriangle,
    Activity,
    ChevronRight
} from "lucide-react";
import {
    fetchSpecialties,
    createSpecialty,
    deleteSpecialty,
    updateSpecialty,
} from "../../features/specialty/specialtySlice";
import PageHeader from "../../components/ui/PageHeader";
import SectionCard from "../../components/ui/SectionCard";
import TableSkeleton from "../../components/skeletons/TableSkeleton";
import EmptyState from "../../components/ui/EmptyState";

export default function AdminSpecialtyPage() {
    const dispatch = useDispatch();
    const theme = useTheme();
    const { specialties, loading, error } = useSelector((state) => state.specialty);

    const [name, setName] = useState("");
    const [editItem, setEditItem] = useState(null);
    const [editName, setEditName] = useState("");
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        dispatch(fetchSpecialties());
    }, [dispatch]);

    const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

    const handleAdd = async () => {
        if (!name.trim()) return;

        const isDuplicate = specialties.some(
            (s) => s.name.toLowerCase() === name.trim().toLowerCase()
        );
        if (isDuplicate) {
            setSnackbar({ open: true, message: "This clinical domain already exists!", severity: "error" });
            return;
        }

        const resultAction = await dispatch(createSpecialty({ name: name.trim() }));
        if (createSpecialty.fulfilled.match(resultAction)) {
            setName("");
            setSnackbar({ open: true, message: "Clinical specialty registered successfully.", severity: "success" });
        }
    };

    const handleUpdate = async () => {
        if (!editName.trim() || !editItem) return;

        const resultAction = await dispatch(
            updateSpecialty({ id: editItem._id, body: { name: editName.trim() } })
        );
        if (updateSpecialty.fulfilled.match(resultAction)) {
            setEditItem(null);
            setSnackbar({ open: true, message: "Specialty updated successfully.", severity: "success" });
        }
    };

    const handleDelete = async () => {
        if (!deleteConfirm) return;

        const resultAction = await dispatch(deleteSpecialty(deleteConfirm._id));
        if (deleteSpecialty.fulfilled.match(resultAction)) {
            setDeleteConfirm(null);
            setSnackbar({ open: true, message: "Specialty removed from registry.", severity: "success" });
        }
    };

    const filteredSpecialties = (specialties || []).filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Box>
            <PageHeader 
                title="Clinical Domains"
                subtitle="Manage the taxonomy of medical specialties. Add or refine specialist categories available for patient pairing."
                breadcrumbs={[
                    { label: "Admin", path: "/admin" },
                    { label: "Specialties", active: true }
                ]}
            />

            <Grid container spacing={4}>
                {/* Registry Controls */}
                <Grid item xs={12} lg={4}>
                    <SectionCard title="Registration" icon={Plus}>
                        <Stack spacing={3}>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                Define a new medical specialty to expand the platform's clinical coverage.
                            </Typography>
                            <TextField
                                fullWidth
                                label="Specialty Name"
                                placeholder="e.g. Neurology"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={loading}
                                variant="outlined"
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                            />
                            <Button
                                variant="contained"
                                fullWidth
                                startIcon={<Plus size={18} />}
                                onClick={handleAdd}
                                disabled={!name.trim() || loading}
                                sx={{ 
                                    py: 1.5, 
                                    borderRadius: 3, 
                                    fontWeight: 900,
                                    boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.2)}`
                                }}
                            >
                                {loading ? "Adding..." : "Register Specialty"}
                            </Button>

                            <Box sx={{ mt: 2, p: 2, borderRadius: 3, bgcolor: alpha(theme.palette.info.main, 0.05), border: '1px solid', borderColor: alpha(theme.palette.info.main, 0.1) }}>
                                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'flex', gap: 1 }}>
                                    <Activity size={14} color={theme.palette.info.main} />
                                    Active categories impact doctor search filters and profile registration.
                                </Typography>
                            </Box>
                        </Stack>
                    </SectionCard>
                </Grid>

                {/* Registry View */}
                <Grid item xs={12} lg={8}>
                    <SectionCard 
                        title="Specialty Registry" 
                        subtitle={`${filteredSpecialties.length} active domains identified`}
                        headerAction={
                            <TextField 
                                placeholder="Filter domains..."
                                size="small"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                sx={{ 
                                    minWidth: 240,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 3,
                                        bgcolor: alpha(theme.palette.background.default, 0.5),
                                    }
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
                        {loading && specialties.length === 0 ? (
                            <TableSkeleton rows={6} cols={3} />
                        ) : filteredSpecialties.length === 0 ? (
                            <Box sx={{ py: 6 }}>
                                <EmptyState 
                                    title="Registry Empty"
                                    message="No specialties found or search criteria matched nothing."
                                    icon={Stethoscope}
                                />
                            </Box>
                        ) : (
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 800, color: "text.secondary", pl: 0 }}>Category Name</TableCell>
                                            <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>Platform Status</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 800, color: "text.secondary", pr: 0 }}>Management</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredSpecialties.map((specialty) => (
                                            <TableRow key={specialty._id} hover sx={{ '&:last-child td': { border: 0 } }}>
                                                <TableCell sx={{ py: 2, pl: 0 }}>
                                                    <Stack direction="row" spacing={2} alignItems="center">
                                                        <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }}>
                                                            <Stethoscope size={18} />
                                                        </Box>
                                                        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                                                            {specialty.name}
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip 
                                                        label="ACTIVE DOMAIN" 
                                                        size="small" 
                                                        sx={{ 
                                                            fontWeight: 800, 
                                                            fontSize: '0.65rem', 
                                                            letterSpacing: 0.5,
                                                            bgcolor: alpha(theme.palette.success.main, 0.08),
                                                            color: 'success.dark',
                                                            borderRadius: 1.5
                                                        }} 
                                                    />
                                                </TableCell>
                                                <TableCell align="right" sx={{ pr: 0 }}>
                                                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                        <IconButton
                                                            onClick={() => {
                                                                setEditItem(specialty);
                                                                setEditName(specialty.name);
                                                            }}
                                                            sx={{ borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), color: 'primary.main' }}
                                                        >
                                                            <Edit2 size={18} />
                                                        </IconButton>
                                                        <IconButton 
                                                            onClick={() => setDeleteConfirm(specialty)}
                                                            sx={{ borderRadius: 2, bgcolor: alpha(theme.palette.error.main, 0.05), color: 'error.main' }}
                                                        >
                                                            <Trash2 size={18} />
                                                        </IconButton>
                                                    </Stack>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </SectionCard>
                </Grid>
            </Grid>

            {/* Update Dialog */}
            <Dialog open={!!editItem} onClose={() => setEditItem(null)} PaperProps={{ sx: { borderRadius: 4, width: '100%', maxWidth: 400 } }}>
                <DialogTitle sx={{ p: 3, pb: 1, fontWeight: 900 }}>Refine Domain Identity</DialogTitle>
                <DialogContent sx={{ px: 3 }}>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Specialty Name"
                        fullWidth
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        variant="outlined"
                        sx={{ mt: 1, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 1 }}>
                    <Button onClick={() => setEditItem(null)} sx={{ fontWeight: 800, color: 'text.secondary' }}>Go Back</Button>
                    <Button
                        onClick={handleUpdate}
                        variant="contained"
                        disabled={!editName.trim() || editName === editItem?.name || loading}
                        sx={{ borderRadius: 2.5, fontWeight: 800, px: 3 }}
                    >
                        Save Identity
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation */}
            <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} PaperProps={{ sx: { borderRadius: 4, maxWidth: 400 } }}>
                <DialogTitle sx={{ p: 3, pb: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <AlertTriangle color={theme.palette.error.main} />
                    <Typography variant="h6" sx={{ fontWeight: 900 }}>Decommission Domain?</Typography>
                </DialogTitle>
                <DialogContent sx={{ px: 3 }}>
                    <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                        Are you sure you want to remove <strong>{deleteConfirm?.name}</strong>? Doctors associated with this specialty may lose their categorization.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 1 }}>
                    <Button onClick={() => setDeleteConfirm(null)} sx={{ fontWeight: 800, color: 'text.secondary' }}>Abort</Button>
                    <Button 
                        onClick={handleDelete} 
                        variant="contained" 
                        color="error"
                        sx={{ borderRadius: 2.5, fontWeight: 800, px: 3 }}
                    >
                        Confirm Removal
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbar.open} autoHideDuration={5000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} variant="filled" icon={<ShieldCheck size={20} />} sx={{ borderRadius: 2.5, fontWeight: 800 }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>

            {error && !snackbar.open && (
                <Alert severity="error" variant="soft" sx={{ mt: 3, borderRadius: 3, fontWeight: 700 }}>{error}</Alert>
            )}
        </Box>
    );
}