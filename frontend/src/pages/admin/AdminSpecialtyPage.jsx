import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Paper,
  Typography,
  Box,
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
  CircularProgress,
  Alert,
  Snackbar,
  Stack,
  Tooltip,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import {
  fetchSpecialties,
  createSpecialty,
  deleteSpecialty,
  updateSpecialty,
} from "../../features/specialty/specialtySlice";

export default function AdminSpecialtyPage() {
  const dispatch = useDispatch();
  const { specialties, loading, error } = useSelector((state) => state.specialty);

  // Local State
  const [name, setName] = useState("");
  const [editItem, setEditItem] = useState(null);
  const [editName, setEditName] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    dispatch(fetchSpecialties());
  }, [dispatch]);

  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  const handleAdd = async () => {
    if (!name.trim()) return;

    // Duplicate check
    const isDuplicate = specialties.some(
      (s) => s.name.toLowerCase() === name.trim().toLowerCase()
    );
    if (isDuplicate) {
      setSnackbar({ open: true, message: "Specialty already exists!", severity: "error" });
      return;
    }

    const resultAction = await dispatch(createSpecialty({ name: name.trim() }));
    if (createSpecialty.fulfilled.match(resultAction)) {
      setName("");
      setSnackbar({ open: true, message: "Specialty added successfully!", severity: "success" });
    }
  };

  const handleUpdate = async () => {
    if (!editName.trim() || !editItem) return;

    const resultAction = await dispatch(
      updateSpecialty({ id: editItem._id, body: { name: editName.trim() } })
    );
    if (updateSpecialty.fulfilled.match(resultAction)) {
      setEditItem(null);
      setSnackbar({ open: true, message: "Specialty updated successfully!", severity: "success" });
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;

    const resultAction = await dispatch(deleteSpecialty(deleteConfirm._id));
    if (deleteSpecialty.fulfilled.match(resultAction)) {
      setDeleteConfirm(null);
      setSnackbar({ open: true, message: "Specialty deleted successfully!", severity: "success" });
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography variant="h4" fontWeight="800" gutterBottom color="primary">
          Manage Specialties
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Add, edit or remove medical specialties from the system.
        </Typography>
      </Box>

      {/* Add Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            fullWidth
            label="New Specialty Name"
            placeholder="e.g. Cardiology"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            variant="outlined"
            size="small"
          />
          <Button
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
            onClick={handleAdd}
            disabled={!name.trim() || loading}
            sx={{ px: 4, borderRadius: 2 }}
          >
            Add
          </Button>
        </Stack>
      </Paper>

      {/* Table Section */}
      <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 3, overflow: "hidden" }}>
        {loading && specialties.length === 0 ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead sx={{ bgcolor: "grey.50" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Specialty Name</TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {specialties.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} align="center" sx={{ py: 6 }}>
                    <Typography color="text.secondary">No specialties found.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                specialties.map((specialty) => (
                  <TableRow key={specialty._id} hover>
                    <TableCell sx={{ fontSize: "1rem" }}>{specialty.name}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton
                          color="primary"
                          onClick={() => {
                            setEditItem(specialty);
                            setEditName(specialty.name);
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton color="error" onClick={() => setDeleteConfirm(specialty)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* Update Dialog */}
      <Dialog open={!!editItem} onClose={() => setEditItem(null)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: "bold" }}>Edit Specialty</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Specialty Name"
            fullWidth
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            variant="outlined"
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setEditItem(null)} color="inherit">Cancel</Button>
          <Button
            onClick={handleUpdate}
            variant="contained"
            disabled={!editName.trim() || editName === editItem?.name || loading}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
        <DialogTitle sx={{ color: "error.main", fontWeight: "bold" }}>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{deleteConfirm?.name}</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setDeleteConfirm(null)} color="inherit">Cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Feedback Notifications */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {error && !snackbar.open && (
        <Alert severity="error" sx={{ mt: 3, borderRadius: 2 }}>{error}</Alert>
      )}
    </Container>
  );
}