import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
    Box, 
    TextField, 
    Button, 
    Grid, 
    Typography, 
    Avatar, 
    Divider, 
    Alert,
    CircularProgress,
    Stack
} from "@mui/material";
import { Save as SaveIcon, Badge as NameIcon, Phone as PhoneIcon, Email as EmailIcon } from "@mui/icons-material";
import { updateProfile, clearError } from "../../features/auth/authSlice";

const ProfileSettings = () => {
    const dispatch = useDispatch();
    const { user, isLoading, error, successMessage } = useSelector((state) => state.auth);
    
    const [formData, setFormData] = useState({
        fullName: "",
        phoneNumber: "",
        address: ""
    });

    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || "",
                phoneNumber: user.phoneNumber || "",
                address: user.address || ""
            });
        }
    }, [user]);

    useEffect(() => {
        return () => {
            dispatch(clearError());
        };
    }, [dispatch]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(updateProfile(formData));
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 800 }}>
            {successMessage && (
                <Alert severity="success" sx={{ mb: 3 }}>{successMessage}</Alert>
            )}
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
            )}

            <Stack spacing={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
                    <Avatar 
                        sx={{ width: 80, height: 80, bgcolor: 'primary.main', fontSize: '2rem' }}
                    >
                        {user?.fullName?.[0]}
                    </Avatar>
                    <Box>
                        <Typography variant="h6">{user?.fullName}</Typography>
                        <Typography variant="body2" color="text.secondary">{user?.role?.toUpperCase()}</Typography>
                    </Box>
                </Box>

                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <NameIcon fontSize="small" color="action" /> Full Name
                        </Typography>
                        <TextField
                            fullWidth
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <EmailIcon fontSize="small" color="action" /> Email Address
                        </Typography>
                        <TextField
                            fullWidth
                            value={user?.email || ""}
                            disabled
                            helperText="Email is managed by administrator."
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PhoneIcon fontSize="small" color="action" /> Phone Number
                        </Typography>
                        <TextField
                            fullWidth
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            placeholder="+1 (555) 000-0000"
                        />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>Address</Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={2}
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </Grid>
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                        disabled={isLoading}
                        sx={{ px: 4, py: 1 }}
                    >
                        {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                </Box>
            </Stack>
        </Box>
    );
};

export default ProfileSettings;
