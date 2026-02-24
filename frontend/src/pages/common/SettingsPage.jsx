import { useState } from "react";
import { useSelector } from "react-redux";
import { 
    Box, 
    Typography, 
    Paper, 
    Tabs, 
    Tab, 
    Container, 
    Breadcrumbs, 
    Link,
    Divider,
    useMediaQuery,
    useTheme
} from "@mui/material";
import { 
    Person as ProfileIcon, 
    VpnKey as PasswordIcon, 
    Notifications as NotifyIcon, 
    LocalHospital as DoctorIcon, 
    AdminPanelSettings as AdminIcon,
    Home as HomeIcon,
    NavigateNext as NextIcon
} from "@mui/icons-material";
import ProfileSettings from "../../components/settings/ProfileSettings";
import PasswordSettings from "../../components/settings/PasswordSettings";
import NotificationSettings from "../../components/settings/NotificationSettings";
import DoctorSettings from "../../components/settings/DoctorSettings";
import AdminSettings from "../../components/settings/AdminSettings";
import { ROLES } from "../../constants/roles";

const TabPanel = (props) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`settings-tabpanel-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ py: 4 }}>
                    {children}
                </Box>
            )}
        </div>
    );
};

const SettingsPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { user } = useSelector((state) => state.auth);
    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    // Define tabs based on role
    const tabs = [
        { label: "Profile", icon: <ProfileIcon />, component: <ProfileSettings /> },
        { label: "Password", icon: <PasswordIcon />, component: <PasswordSettings /> },
        { label: "Notifications", icon: <NotifyIcon />, component: <NotificationSettings /> },
    ];

    if (user?.role === ROLES.DOCTOR) {
        tabs.push({ label: "Professional Info", icon: <DoctorIcon />, component: <DoctorSettings /> });
    }

    if (user?.role === ROLES.ADMIN) {
        tabs.push({ label: "System Config", icon: <AdminIcon />, component: <AdminSettings /> });
    }

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Breadcrumbs */}
            <Breadcrumbs separator={<NextIcon fontSize="small" />} sx={{ mb: 3 }}>
                <Link color="inherit" href="/" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, textDecoration: 'none' }}>
                    <HomeIcon fontSize="inherit" /> Home
                </Link>
                <Typography color="text.primary">Settings</Typography>
            </Breadcrumbs>

            <Typography variant="h4" sx={{ fontWeight: 800, mb: 4, color: '#1a237e' }}>
                Account Settings
            </Typography>

            <Paper 
                elevation={0} 
                sx={{ 
                    borderRadius: 4, 
                    border: '1px solid rgba(0,0,0,0.08)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    minHeight: '70vh'
                }}
            >
                {/* Navigation Tabs */}
                <Box 
                    sx={{ 
                        width: isMobile ? '100%' : 280, 
                        bgcolor: 'rgba(0,0,0,0.02)',
                        borderRight: isMobile ? 'none' : '1px solid rgba(0,0,0,0.08)',
                        borderBottom: isMobile ? '1px solid rgba(0,0,0,0.08)' : 'none',
                        pt: 2
                    }}
                >
                    <Tabs
                        orientation={isMobile ? "horizontal" : "vertical"}
                        variant="scrollable"
                        value={activeTab}
                        onChange={handleTabChange}
                        sx={{
                            '& .MuiTab-root': {
                                alignItems: isMobile ? 'center' : 'flex-start',
                                textAlign: 'left',
                                py: 2,
                                px: 3,
                                minHeight: isMobile ? 48 : 60,
                                fontWeight: 600,
                                color: 'text.secondary',
                                '&.Mui-selected': {
                                    color: 'primary.main',
                                    bgcolor: 'rgba(25, 118, 210, 0.08)'
                                }
                            },
                            '& .MuiTabs-indicator': {
                                left: isMobile ? undefined : 0,
                                width: isMobile ? undefined : 4,
                                height: isMobile ? 3 : undefined,
                                borderRadius: '0 4px 4px 0'
                            }
                        }}
                    >
                        {tabs.map((tab, index) => (
                            <Tab 
                                key={index} 
                                label={tab.label} 
                                icon={tab.icon} 
                                iconPosition="start" 
                                disableRipple
                            />
                        ))}
                    </Tabs>
                </Box>

                {/* Content Area */}
                <Box sx={{ flexGrow: 1, p: { xs: 2, md: 4 } }}>
                    {tabs.map((tab, index) => (
                        <TabPanel key={index} value={activeTab} index={index}>
                            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                                {tab.label}
                            </Typography>
                            <Divider sx={{ mb: 4 }} />
                            {tab.component}
                        </TabPanel>
                    ))}
                </Box>
            </Paper>
        </Container>
    );
};

export default SettingsPage;
