import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
    Box, 
    Typography, 
    Paper, 
    Grid, 
    TextField, 
    Button, 
    Avatar, 
    Divider, 
    Alert,
    Stack,
    Card,
    CardContent,
    CircularProgress
} from "@mui/material";
import { 
    Person as ProfileIcon, 
    Save as SaveIcon,
    Email as EmailIcon,
    Badge as NameIcon,
    Phone as PhoneIcon
} from "@mui/icons-material";
import { updateProfile } from "../../features/auth/authSlice";

const PatientProfilePage = () => {
    const dispatch = useDispatch();
    const { user, isLoading, error } = useSelector((state) => state.auth);
    
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
        address: ""
    });

    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || "",
                email: user.email || "",
                phoneNumber: user.phoneNumber || "",
                address: user.address || ""
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setSuccess(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(updateProfile(formData));
        if (!result.error) {
            setSuccess(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    if (isLoading && !user) return <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}><CircularProgress /></Box>;

    return (
        <Box sx={{ p: 4, maxWidth: 1000, mx: "auto" }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: "#1a237e" }}>
                    My Account
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    View and update your personal information.
                </Typography>
            </Box>

            {success && (
                <Alert severity="success" sx={{ mb: 4, borderRadius: 2 }}>
                    Your profile has been updated successfully.
                </Alert>
            )}

            {error && (
                <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
                    {error}
                </Alert>
            )}

            <form onSubmit={handleSubmit}>
                <Grid container spacing={4}>
                    {/* Sidebar Info */}
                    <Grid item xs={12} md={4}>
                        <Card sx={{ borderRadius: 4, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
                            <CardContent sx={{ textAlign: "center", py: 5 }}>
                                <Avatar 
                                    sx={{ 
                                        width: 120, 
                                        height: 120, 
                                        mx: "auto", 
                                        mb: 3, 
                                        bgcolor: "secondary.main",
                                        fontSize: "3rem"
                                    }}
                                >
                                    {user?.fullName?.[0]}
                                </Avatar>
                                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                    {user?.fullName}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    {user?.role?.toUpperCase()}
                                </Typography>
                                <Typography variant="caption" sx={{ display: "block", color: "text.disabled", mt: 1 }}>
                                    Member since {new Date().getFullYear()}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Form Fields */}
                    <Grid item xs={12} md={8}>
                        <Paper sx={{ p: 4, borderRadius: 4, border: "1px solid rgba(0,0,0,0.05)" }}>
                            <Stack spacing={4}>
                                <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
                                        <NameIcon color="primary" fontSize="small" /> Full Name
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                    />
                                </Box>

                                <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
                                        <EmailIcon color="primary" fontSize="small" /> Email Address
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        name="email"
                                        value={formData.email}
                                        disabled
                                        helperText="Email cannot be changed for security reasons."
                                    />
                                </Box>

                                <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
                                        <PhoneIcon color="primary" fontSize="small" /> Phone Number
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </Box>

                                <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5 }}>
                                        Home Address
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={2}
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="123 Medical St, Health City"
                                    />
                                </Box>

                                <Divider />

                                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                                    <Button 
                                        type="submit" 
                                        variant="contained" 
                                        startIcon={<SaveIcon />}
                                        disabled={isLoading}
                                        sx={{ borderRadius: 3, px: 4, py: 1.5, fontWeight: 700 }}
                                    >
                                        {isLoading ? "Saving..." : "Update Profile"}
                                    </Button>
                                </Box>
                            </Stack>
                        </Paper>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
};

export default PatientProfilePage;
