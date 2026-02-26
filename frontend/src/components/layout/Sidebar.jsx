import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    Box, 
    List, 
    ListItem, 
    ListItemButton, 
    ListItemIcon, 
    Tooltip,
    Drawer,
    IconButton,
    Badge,
    Typography,
    alpha,
    useTheme
} from "@mui/material";
import {
    LayoutDashboard as DashboardIcon,
    Users as PeopleIcon,
    Calendar as CalendarIcon,
    Mail as MailIcon,
    BriefcaseMedical as AppointmentsIcon,
    Settings as SettingsIcon,
    Stethoscope as SpecialityIcon,
    ShieldCheck as ApprovalIcon,
    PlusSquare as PlusIcon
} from "lucide-react";

import { ROLES } from "../../constants/roles";

const DRAWER_WIDTH = 100;

const Sidebar = ({ open, toggleDrawer, isMobile }) => {
    const { user } = useSelector((state) => state.auth);
    const theme = useTheme();
    const conversations = useSelector((state) => state.chat?.conversations || []);
    const totalUnreadChat = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
    const location = useLocation();
    const navigate = useNavigate();

    const getMenuItems = (role) => {
        const common = [];
        
        const patientItems = [
            { id: "home", icon: <DashboardIcon size={24} />, path: "/patient", label: "Home" },
            { id: "doctors", icon: <PeopleIcon size={24} />, path: "/patient/doctors", label: "Find Doctors" },
            { id: "appointments", icon: <AppointmentsIcon size={24} />, path: "/patient/appointments", label: "My Appointments" },
            { id: "chat", icon: <MailIcon size={24} />, path: "/patient/chat", label: "Chat" },
        ];

        const doctorItems = [
            { id: "dashboard", icon: <DashboardIcon size={24} />, path: "/doctor/dashboard", label: "Dashboard" },
            { id: "appointments", icon: <AppointmentsIcon size={24} />, path: "/doctor/appointments", label: "Appointments" },
            { id: "schedule", icon: <CalendarIcon size={24} />, path: "/doctor/schedule", label: "Manage Schedule" },
            { id: "chat", icon: <MailIcon size={24} />, path: "/doctor/chat", label: "Chat" },
        ];

        const adminItems = [
            { id: "dashboard", icon: <DashboardIcon size={24} />, path: "/admin/dashboard", label: "Admin Console" },
            { id: "approvals", icon: <ApprovalIcon size={24} />, path: "/admin/doctor-approvals", label: "Doctor Approvals" },
            { id: "users", icon: <PeopleIcon size={24} />, path: "/admin/users", label: "Manage Users" },
            { id: "specialties", icon: <SpecialityIcon size={24} />, path: "/admin/specialties", label: "Manage Specialties" },
            { id: "appointments", icon: <AppointmentsIcon size={24} />, path: "/admin/appointments", label: "All Appointments" },
        ];

        switch (role) {
            case ROLES.DOCTOR: return [...doctorItems, ...common];
            case ROLES.ADMIN: return [...adminItems, ...common];
            default: return [...patientItems, ...common];
        }
    };

    const menuItems = getMenuItems(user?.role);

    const drawerContent = (
        <Box
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                py: 4,
                bgcolor: "background.paper", 
                color: "text.primary",
                borderRadius: isMobile ? 0 : "0 30px 30px 0",
                transition: "all 0.3s ease",
                boxShadow: theme.palette.mode === "dark" 
                    ? "10px 0 20px rgba(0,0,0,0.4)" 
                    : "10px 0 20px rgba(0,0,0,0.05)",
                borderRight: "1px solid",
                borderColor: "divider"
            }}
        >
            {/* Branding Logo */}
            <Box 
              sx={{ 
                mb: 6, 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center",
                cursor: "pointer"
              }}
              onClick={() => navigate("/")}
            >
              <Box 
                sx={{ 
                  width: 50, 
                  height: 50, 
                  borderRadius: 3, 
                  bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : alpha(theme.palette.primary.main, 0.1), 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  mb: 1,
                  boxShadow: theme.palette.mode === "dark" ? "none" : "0 4px 12px rgba(21, 101, 192, 0.1)",
                  border: "1px solid",
                  borderColor: "divider"
                }}
              >
                <PlusIcon color={theme.palette.primary.main} size={32} strokeWidth={3} />
              </Box>
              <Typography variant="caption" sx={{ fontWeight: 900, letterSpacing: 2, color: "text.secondary" }}>
                MEDIC
              </Typography>
            </Box>

            <List sx={{ width: "100%", mt: 0, px: 0 }}>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <ListItem 
                            key={item.id} 
                            disablePadding 
                            sx={{ 
                                mb: 1, 
                                justifyContent: "center",
                                position: "relative",
                                // Active indicator bar
                                "&::before": {
                                    content: '""',
                                    position: "absolute",
                                    left: 0,
                                    top: "15%",
                                    height: isActive ? "70%" : "0%",
                                    width: "4px",
                                    bgcolor: "primary.main", 
                                    borderRadius: "0 4px 4px 0",
                                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                    opacity: isActive ? 1 : 0,
                                    boxShadow: isActive ? `0 0 12px ${alpha(theme.palette.primary.main, 0.5)}` : "none"
                                }
                            }}
                        >
                            <Tooltip title={item.label} placement="right" arrow>
                                <ListItemButton
                                    onClick={() => navigate(item.path)}
                                    sx={{
                                        minWidth: 0,
                                        justifyContent: "center",
                                        bgcolor: isActive ? alpha(theme.palette.primary.main, 0.1) : "transparent",
                                        color: isActive ? "primary.main" : "text.secondary",
                                        borderRadius: "14px",
                                        width: "64px",
                                        height: "64px",
                                        "&:hover": {
                                            bgcolor: isActive ? alpha(theme.palette.primary.main, 0.15) : "action.hover",
                                            color: "primary.main",
                                            "& .MuiListItemIcon-root": {
                                                transform: "scale(1.1)",
                                            }
                                        },
                                        mx: "auto",
                                        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                                        // Prevent layout shift
                                        padding: 0,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 0.5
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            justifyContent: "center",
                                            color: "inherit",
                                            transition: "inherit",
                                        }}
                                    >
                                        {item.id === "chat" ? (
                                            <Badge 
                                                badgeContent={totalUnreadChat} 
                                                color="error" 
                                                max={99}
                                                sx={{ 
                                                    "& .MuiBadge-badge": { 
                                                         fontSize: "0.65rem", 
                                                         height: 18, 
                                                         minWidth: 18,
                                                         border: `2px solid ${theme.palette.mode === "dark" ? theme.palette.background.paper : "#1A237E"}`
                                                     } 
                                                 }}
                                            >
                                                {item.icon}
                                            </Badge>
                                        ) : (
                                            item.icon
                                        )}
                                    </ListItemIcon>
                                    <Typography 
                                        variant="caption" 
                                        sx={{ 
                                            fontSize: "0.6rem", 
                                            fontWeight: isActive ? 800 : 500,
                                            opacity: isActive ? 1 : 0.7,
                                            transition: "inherit"
                                        }}
                                    >
                                        {item.label}
                                    </Typography>
                                </ListItemButton>
                            </Tooltip>
                        </ListItem>
                    );
                })}
            </List>

            <Box sx={{ mt: "auto", mb: 2 }}>
                <Tooltip title="Settings" placement="right" arrow>
                    <IconButton 
                        onClick={() => navigate("/settings")}
                        sx={{ 
                          color: "text.secondary",
                          "&:hover": { color: "primary.main", bgcolor: "action.hover" }
                        }}
                    >
                        <SettingsIcon size={24} />
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    );

    if (isMobile) {
        return (
            <Drawer
                variant="temporary"
                open={open}
                onClose={toggleDrawer}
                ModalProps={{ keepMounted: true }}
                sx={{
                    "& .MuiDrawer-paper": { width: DRAWER_WIDTH, boxSizing: "border-box", border: "none", backgroundColor: "transparent" },
                }}
            >
                {drawerContent}
            </Drawer>
        );
    }

    return (
        <Box
            component="nav"
            sx={{
                width: DRAWER_WIDTH,
                flexShrink: 0,
                height: "100vh",
                position: "fixed",
                left: 0,
                top: 0,
                zIndex: 1200,
            }}
        >
            {drawerContent}
        </Box>
    );
};

export default Sidebar;

