import { useState } from "react";
import { 
    Box, 
    Typography, 
    Switch, 
    List, 
    ListItem, 
    ListItemText, 
    ListItemIcon,
    Paper,
    Divider,
    Button,
    Alert
} from "@mui/material";
import { 
    Email as EmailIcon, 
    NotificationsActive as BellIcon,
    Security as SecurityIcon,
    CalendarMonth as BookingIcon
} from "@mui/icons-material";

const NotificationSettings = () => {
    const [settings, setSettings] = useState({
        emailNotifications: true,
        bookingConfirmations: true,
        securityAlerts: true,
        marketingEmails: false
    });
    const [saved, setSaved] = useState(false);

    const handleToggle = (name) => {
        setSettings(prev => ({ ...prev, [name]: !prev[name] }));
        setSaved(false);
    };

    const handleSave = () => {
        // Placeholder for API call
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <Box sx={{ maxWidth: 600 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>Communication Preferences</Typography>
            
            {saved && (
                <Alert severity="success" sx={{ mb: 3 }}>Preferences saved successfully!</Alert>
            )}

            <Paper variant="outlined" sx={{ borderRadius: 2 }}>
                <List disablePadding>
                    <ListItem sx={{ py: 2 }}>
                        <ListItemIcon><EmailIcon color="primary" /></ListItemIcon>
                        <ListItemText 
                            primary="Email Notifications" 
                            secondary="Receive general updates and messages via email." 
                        />
                        <Switch 
                            checked={settings.emailNotifications} 
                            onChange={() => handleToggle('emailNotifications')} 
                        />
                    </ListItem>
                    <Divider />
                    <ListItem sx={{ py: 2 }}>
                        <ListItemIcon><BookingIcon color="primary" /></ListItemIcon>
                        <ListItemText 
                            primary="Booking Confirmations" 
                            secondary="Get notified when an appointment is booked or cancelled." 
                        />
                        <Switch 
                            checked={settings.bookingConfirmations} 
                            onChange={() => handleToggle('bookingConfirmations')} 
                        />
                    </ListItem>
                    <Divider />
                    <ListItem sx={{ py: 2 }}>
                        <ListItemIcon><SecurityIcon color="primary" /></ListItemIcon>
                        <ListItemText 
                            primary="Security Alerts" 
                            secondary="Important notifications about your account security." 
                        />
                        <Switch 
                            checked={settings.securityAlerts} 
                            onChange={() => handleToggle('securityAlerts')} 
                            disabled 
                        />
                    </ListItem>
                    <Divider />
                    <ListItem sx={{ py: 2 }}>
                        <ListItemIcon><BellIcon color="primary" /></ListItemIcon>
                        <ListItemText 
                            primary="Marketing & Promotional" 
                            secondary="Receive news about new services and special offers." 
                        />
                        <Switch 
                            checked={settings.marketingEmails} 
                            onChange={() => handleToggle('marketingEmails')} 
                        />
                    </ListItem>
                </List>
            </Paper>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button variant="contained" onClick={handleSave}>
                    Save Preferences
                </Button>
            </Box>
        </Box>
    );
};

export default NotificationSettings;
