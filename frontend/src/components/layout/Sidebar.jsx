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
                bgcolor: "#1A237E", // Deep Indigo for medical theme
                color: "white",
                borderRadius: isMobile ? 0 : "0 30px 30px 0",
                transition: "all 0.3s ease",
                boxShadow: "10px 0 20px rgba(0,0,0,0.05)"
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
                  bgcolor: "rgba(255,255,255,0.15)", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  mb: 1,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                }}
              >
                <PlusIcon color="white" size={32} strokeWidth={3} />
              </Box>
              <Typography variant="caption" sx={{ fontWeight: 900, letterSpacing: 2, opacity: 0.8 }}>
                MEDIC
              </Typography>
            </Box>

            <List sx={{ width: "100%", mt: 0 }}>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <ListItem key={item.id} disablePadding sx={{ mb: 2, justifyContent: "center" }}>
                            <Tooltip title={item.label} placement="right" arrow>
                                <ListItemButton
                                    onClick={() => navigate(item.path)}
                                    sx={{
                                        minWidth: 0,
                                        justifyContent: "center",
                                        bgcolor: isActive ? "white" : "transparent",
                                        color: isActive ? "#1A237E" : "rgba(255,255,255,0.7)",
                                        borderRadius: "16px",
                                        width: "56px",
                                        height: "56px",
                                        "&:hover": {
                                            bgcolor: isActive ? "white" : "rgba(255, 255, 255, 0.1)",
                                            color: "white"
                                        },
                                        mx: "auto",
                                        transition: "all 0.2s ease"
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            justifyContent: "center",
                                            color: "inherit",
                                        }}
                                    >
                                        {item.id === "chat" ? (
                                            <Badge badgeContent={totalUnreadChat} color="error" max={99}>
                                                {item.icon}
                                            </Badge>
                                        ) : (
                                            item.icon
                                        )}
                                    </ListItemIcon>
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
                          color: "rgba(255,255,255,0.7)",
                          "&:hover": { color: "white", bgcolor: "rgba(255,255,255,0.1)" }
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

