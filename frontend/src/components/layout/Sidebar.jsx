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
    IconButton
} from "@mui/material";
import {
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    CalendarMonth as CalendarIcon,
    Email as MailIcon,
    Work as AppointmentsIcon,
    Settings as SettingsIcon,
    BarChart as AnalyticsIcon,
    ChevronLeft as ChevronLeftIcon,
    Person as ProfileIcon,
    Category as SpecialityIcon,
    AssignmentTurnedIn as ApprovalIcon
} from "@mui/icons-material";

import { ROLES } from "../../constants/roles";

const DRAWER_WIDTH = 100;


const Sidebar = ({ open, toggleDrawer, isMobile }) => {
    const { user } = useSelector((state) => state.auth);
    const location = useLocation();
    const navigate = useNavigate();

    const getMenuItems = (role) => {
        const common = [];
        
        const patientItems = [
            { id: "home", icon: <DashboardIcon />, path: "/patient", label: "Home" },
            { id: "doctors", icon: <PeopleIcon />, path: "/patient/doctors", label: "Find Doctors" },
            { id: "appointments", icon: <AppointmentsIcon />, path: "/patient/appointments", label: "My Appointments" },
            { id: "settings", icon: <ProfileIcon />, path: "/settings", label: "Profile Settings" },
        ];

        const doctorItems = [
            { id: "dashboard", icon: <DashboardIcon />, path: "/doctor/dashboard", label: "Dashboard" },
            { id: "appointments", icon: <AppointmentsIcon />, path: "/doctor/appointments", label: "Appointments" },
            { id: "schedule", icon: <CalendarIcon />, path: "/doctor/schedule", label: "Manage Schedule" },
            { id: "settings", icon: <ProfileIcon />, path: "/settings", label: "Professional Profile" },
        ];

        const adminItems = [
            { id: "dashboard", icon: <DashboardIcon />, path: "/admin/dashboard", label: "Admin Console" },
            { id: "approvals", icon: <ApprovalIcon />, path: "/admin/doctor-approvals", label: "Doctor Approvals" },
            { id: "users", icon: <PeopleIcon />, path: "/admin/users", label: "Manage Users" },
            { id: "specialties", icon: <SpecialityIcon />, path: "/admin/specialties", label: "Manage Specialties" },
            { id: "appointments", icon: <AppointmentsIcon />, path: "/admin/appointments", label: "All Appointments" },
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
                bgcolor: "#263238", // Dark sidebar background
                color: "white",
                borderRadius: isMobile ? 0 : "0 40px 40px 0", // Matching the rounded design
                transition: "width 0.3s ease",
            }}
        >
            <List sx={{ width: "100%", mt: 2 }}>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <ListItem key={item.id} disablePadding sx={{ mb: 3, justifyContent: "center" }}>
                            <Tooltip title={item.label} placement="right">
                                <ListItemButton
                                    onClick={() => navigate(item.path)}
                                    sx={{
                                        minWidth: 0,
                                        justifyContent: "center",
                                        bgcolor: isActive ? "rgba(255, 255, 255, 0.9)" : "transparent",
                                        color: isActive ? "#263238" : "white",
                                        borderRadius: "20px",
                                        width: "60px",
                                        height: "60px",
                                        "&:hover": {
                                            bgcolor: isActive ? "white" : "rgba(255, 255, 255, 0.1)",
                                        },
                                        mx: "auto"
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            justifyContent: "center",
                                            color: "inherit",
                                        }}
                                    >
                                        {item.icon}
                                    </ListItemIcon>
                                </ListItemButton>
                            </Tooltip>
                        </ListItem>
                    );
                })}
            </List>

            <Box sx={{ mt: "auto", mb: 5 }}>
                <Tooltip title="Settings" placement="right">
                    <IconButton 
                        onClick={() => navigate("/settings")}
                        sx={{ color: "white" }}
                    >
                        <SettingsIcon />
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
                    "& .MuiDrawer-paper": { width: DRAWER_WIDTH, boxSizing: "border-box", border: "none" },
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
