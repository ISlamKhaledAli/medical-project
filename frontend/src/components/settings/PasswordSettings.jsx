import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
    Box, 
    TextField, 
    Button, 
    Typography, 
    Alert,
    CircularProgress,
    Stack,
    IconButton,
    InputAdornment,
    LinearProgress
} from "@mui/material";
import { Visibility, VisibilityOff, Lock as LockIcon } from "@mui/icons-material";
import { changePassword, clearError } from "../../features/auth/authSlice";

const PasswordSettings = () => {
    const dispatch = useDispatch();
    const { isLoading, error, successMessage } = useSelector((state) => state.auth);
    
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [showPasswords, setShowPasswords] = useState(false);
    const [strength, setStrength] = useState(0);

    useEffect(() => {
        return () => {
            dispatch(clearError());
        };
    }, [dispatch]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (name === "newPassword") {
            calculateStrength(value);
        }
    };

    const calculateStrength = (password) => {
        let score = 0;
        if (password.length > 8) score += 25;
        if (/[A-Z]/.test(password)) score += 25;
        if (/[0-9]/.test(password)) score += 25;
        if (/[^A-Za-z0-9]/.test(password)) score += 25;
        setStrength(score);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            return; // Handled by MUI error prop
        }
        dispatch(changePassword({
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword
        }));
        setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setStrength(0);
    };

    const getStrengthColor = () => {
        if (strength <= 25) return "error";
        if (strength <= 50) return "warning";
        if (strength <= 75) return "info";
        return "success";
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 500 }}>
            {successMessage && (
                <Alert severity="success" sx={{ mb: 3 }}>Password updated successfully!</Alert>
            )}
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
            )}

            <Stack spacing={3}>
                <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Current Password</Typography>
                    <TextField
                        fullWidth
                        type={showPasswords ? "text" : "password"}
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        required
                    />
                </Box>

                <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>New Password</Typography>
                    <TextField
                        fullWidth
                        type={showPasswords ? "text" : "password"}
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        required
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPasswords(!showPasswords)} edge="end">
                                        {showPasswords ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    {formData.newPassword && (
                        <Box sx={{ mt: 1 }}>
                            <LinearProgress 
                                variant="determinate" 
                                value={strength} 
                                color={getStrengthColor()} 
                                sx={{ height: 4, borderRadius: 2 }}
                            />
                            <Typography variant="caption" color="text.secondary">
                                Password strength: {strength}%
                            </Typography>
                        </Box>
                    )}
                </Box>

                <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Confirm New Password</Typography>
                    <TextField
                        fullWidth
                        type={showPasswords ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        error={formData.confirmPassword !== "" && formData.newPassword !== formData.confirmPassword}
                        helperText={formData.confirmPassword !== "" && formData.newPassword !== formData.confirmPassword ? "Passwords do not match" : ""}
                    />
                </Box>

                <Button
                    type="submit"
                    variant="contained"
                    disabled={isLoading || !formData.currentPassword || !formData.newPassword || formData.newPassword !== formData.confirmPassword}
                    startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <LockIcon />}
                    sx={{ py: 1.5 }}
                >
                    {isLoading ? "Updating..." : "Update Password"}
                </Button>
            </Stack>
        </Box>
    );
};

export default PasswordSettings;
