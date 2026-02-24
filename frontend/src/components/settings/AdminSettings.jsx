import { 
    Box, 
    Typography, 
    Paper, 
    List, 
    ListItem, 
    ListItemText, 
    ListItemIcon, 
    Switch,
    Divider
} from "@mui/material";
import { 
    SettingsOutlined as SystemIcon, 
    LockPerson as AuthIcon, 
    Language as LangIcon,
    Storage as DbIcon
} from "@mui/icons-material";

const AdminSettings = () => {
    return (
        <Box sx={{ maxWidth: 800 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>System Configuration</Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Administrator-only settings for global application behavior.
            </Typography>

            <Paper variant="outlined" sx={{ borderRadius: 2 }}>
                <List disablePadding>
                    <ListItem sx={{ py: 2 }}>
                        <ListItemIcon><SystemIcon color="info" /></ListItemIcon>
                        <ListItemText 
                            primary="Maintenance Mode" 
                            secondary="Disable public access to the application for maintenance." 
                        />
                        <Switch />
                    </ListItem>
                    <Divider />
                    <ListItem sx={{ py: 2 }}>
                        <ListItemIcon><AuthIcon color="info" /></ListItemIcon>
                        <ListItemText 
                            primary="Self-Registration" 
                            secondary="Allow new patients to register themselves." 
                        />
                        <Switch defaultChecked />
                    </ListItem>
                    <Divider />
                    <ListItem sx={{ py: 2 }}>
                        <ListItemIcon><LangIcon color="info" /></ListItemIcon>
                        <ListItemText 
                            primary="Default Language" 
                            secondary="Set the default language for new users." 
                        />
                        <Typography variant="button">English</Typography>
                    </ListItem>
                    <Divider />
                    <ListItem sx={{ py: 2 }}>
                        <ListItemIcon><DbIcon color="info" /></ListItemIcon>
                        <ListItemText 
                            primary="Database Backups" 
                            secondary="Automatic daily database backups." 
                        />
                        <Switch defaultChecked disabled />
                    </ListItem>
                </List>
            </Paper>
        </Box>
    );
};

export default AdminSettings;
