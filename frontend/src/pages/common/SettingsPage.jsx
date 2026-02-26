import { useState } from "react";
import { useSelector } from "react-redux";
import { 
    Box, 
    Typography, 
    Tabs, 
    Tab, 
    Divider,
    useMediaQuery,
    useTheme,
    alpha,
    Stack,
    Paper
} from "@mui/material";
import { 
    User, 
    Shield, 
    Bell, 
    Award, 
    Settings2,
    Lock,
    Settings,
    ChevronRight,
    Sparkles
} from "lucide-react";
import ProfileSettings from "../../components/settings/ProfileSettings";
import PasswordSettings from "../../components/settings/PasswordSettings";
import NotificationSettings from "../../components/settings/NotificationSettings";
import DoctorSettings from "../../components/settings/DoctorSettings";
import AdminSettings from "../../components/settings/AdminSettings";
import { ROLES } from "../../constants/roles";
import PageHeader from "../../components/ui/PageHeader";

const TabPanel = (props) => {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} id={`settings-tabpanel-${index}`} {...other}>
            {value === index && <Box sx={{ transition: 'all 0.3s ease' }}>{children}</Box>}
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

    const tabs = [
        { label: "Profile Identity", icon: <User size={18} />, component: <ProfileSettings />, desc: "Update your personal credentials and visibility" },
        { label: "Security & Pass", icon: <Lock size={18} />, component: <PasswordSettings />, desc: "Adjust your authentication and safety patterns" },
        { label: "System Alerts", icon: <Bell size={18} />, component: <NotificationSettings />, desc: "Configure how you receive platform updates" },
    ];

    if (user?.role === ROLES.DOCTOR) {
        tabs.push({ label: "Clinical Context", icon: <Award size={18} />, component: <DoctorSettings />, desc: "Manage your professional expertise and fees" });
    }

    if (user?.role === ROLES.ADMIN) {
        tabs.push({ label: "Global Governance", icon: <Settings size={18} />, component: <AdminSettings />, desc: "System-wide configuration and audit controls" });
    }

    return (
        <Box>
            <PageHeader 
                title="Account Architecture"
                subtitle="Configure your digital medical presence. Adjust privacy, security, and professional attributes."
                breadcrumbs={[
                    { label: "Platform", path: "/" },
                    { label: "Settings", active: true }
                ]}
            />

            <Paper 
                elevation={0} 
                sx={{ 
                    borderRadius: 5, 
                    border: '1px solid',
                    borderColor: 'divider',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    minHeight: '75vh',
                    bgcolor: 'background.paper'
                }}
            >
                {/* Navigation Sidebar */}
                <Box 
                    sx={{ 
                        width: isMobile ? '100%' : 320, 
                        bgcolor: alpha(theme.palette.background.default, 0.4),
                        borderRight: isMobile ? 'none' : '1px solid',
                        borderRightColor: 'divider',
                        borderBottom: isMobile ? '1px solid' : 'none',
                        borderBottomColor: 'divider',
                        p: 2
                    }}
                >
                    <Box sx={{ p: 2, mb: 2 }}>
                        <Typography variant="caption" sx={{ fontWeight: 900, textTransform: 'uppercase', color: 'text.disabled', letterSpacing: 1.5 }}>
                            Management Console
                        </Typography>
                    </Box>

                    <Tabs
                        orientation={isMobile ? "horizontal" : "vertical"}
                        variant="scrollable"
                        value={activeTab}
                        onChange={handleTabChange}
                        sx={{
                            '& .MuiTabs-indicator': {
                                left: isMobile ? undefined : 0,
                                width: isMobile ? undefined : 4,
                                height: isMobile ? 3 : undefined,
                                borderRadius: '0 4px 4px 0',
                                bgcolor: 'primary.main'
                            },
                            '& .MuiTab-root': {
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                textAlign: 'left',
                                py: 2.5,
                                px: 3,
                                minHeight: 64,
                                borderRadius: 3,
                                mb: 1,
                                transition: '0.2s',
                                '&.Mui-selected': {
                                    color: 'primary.main',
                                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                                    '& .tab-desc': { color: alpha(theme.palette.primary.main, 0.7) }
                                },
                                '&:hover:not(.Mui-selected)': {
                                    bgcolor: alpha(theme.palette.text.primary, 0.02)
                                }
                            }
                        }}
                    >
                        {tabs.map((tab, index) => (
                            <Tab 
                                key={index} 
                                label={
                                    <Box sx={{ width: '100%', ml: 1 }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 800, textTransform: 'none', display: 'block' }}>
                                            {tab.label}
                                        </Typography>
                                        {!isMobile && (
                                            <Typography variant="caption" className="tab-desc" sx={{ fontWeight: 500, color: 'text.secondary', display: 'block', mt: 0.5 }}>
                                                {tab.desc}
                                            </Typography>
                                        )}
                                    </Box>
                                }
                                icon={tab.icon} 
                                iconPosition="start" 
                                disableRipple
                            />
                        ))}
                    </Tabs>

                    <Box sx={{ mt: 'auto', p: 3, textAlign: 'center' }}>
                        <Paper 
                            variant="outlined" 
                            sx={{ 
                                p: 2, 
                                borderRadius: 3, 
                                bgcolor: alpha(theme.palette.primary.main, 0.03), 
                                border: '1px dashed', 
                                borderColor: alpha(theme.palette.primary.main, 0.2) 
                            }}
                        >
                            <Sparkles size={20} color={theme.palette.primary.main} />
                            <Typography variant="caption" sx={{ display: 'block', mt: 1, fontWeight: 700, color: 'primary.dark' }}>
                                Account Verified
                            </Typography>
                        </Paper>
                    </Box>
                </Box>

                {/* Main Content Area */}
                <Box sx={{ flexGrow: 1, p: { xs: 3, md: 6 } }}>
                    {tabs.map((tab, index) => (
                        <TabPanel key={index} value={activeTab} index={index}>
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h5" sx={{ fontWeight: 900, mb: 1, color: 'text.primary' }}>
                                    {tab.label}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                    {tab.desc}
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 6, opacity: 0.6 }} />
                            <Box sx={{ maxWidth: 800 }}>
                                {tab.component}
                            </Box>
                        </TabPanel>
                    ))}
                </Box>
            </Paper>
        </Box>
    );
};

export default SettingsPage;
