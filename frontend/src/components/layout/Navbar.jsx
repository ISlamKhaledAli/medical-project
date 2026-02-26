import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
    AppBar, 
    Toolbar, 
    Box, 
    InputBase, 
    IconButton, 
    Avatar, 
    Typography,
    Paper,
    Menu,
    MenuItem,
    Divider,
    ListItemIcon,
    Badge
} from "@mui/material";
import { 
    Search as SearchIcon, 
    MailOutline as MailIcon,
    Menu as MenuIcon,
    KeyboardArrowDown as ArrowDownIcon,
    Logout as LogoutIcon,
    Person as PersonIcon,
    Settings as SettingsIcon
} from "@mui/icons-material";
import { useState } from "react";
import { logoutUser } from "../../features/auth/authSlice";
import { fetchConversations } from "../../features/chat/chatSlice";
import { setGlobalSearchQuery, clearGlobalSearchQuery } from "../../features/ui/uiSlice";
import NotificationBell from "./NotificationBell";
import { ROLES } from "../../constants/roles";

// Helper function to get page title based on route
const getPageTitle = (pathname, user) => {
    const firstName = user?.fullName?.split(' ')[0] || user?.name?.split(' ')[0] || "User";
    
    // Dashboard/root pages - show welcome message
    if (pathname === '/patient' || pathname === '/doctor/dashboard' || pathname === '/admin') {
        return `Welcome back, ${firstName}!`;
    }
    
    // Page titles based on route
    const pageTitles = {
        '/patient/doctors': 'Find Doctors',
        '/patient/doctors/:id': 'Doctor Details',
        '/patient/book': 'Book Appointment',
        '/patient/appointments': 'My Appointments',
        '/patient/chat': 'Messages',
        '/patient/profile': 'My Profile',
        '/doctor/schedule': 'Schedule Management',
        '/doctor/appointments': 'Appointments',
        '/doctor/chat': 'Messages',
        '/doctor/profile': 'My Profile',
        '/admin/users': 'User Management',
        '/admin/doctor-approvals': 'Doctor Approvals',
        '/admin/specialties': 'Specialties',
        '/admin/appointments': 'All Appointments',
        '/notifications': 'Notifications',
        '/chat': 'Messages',
        '/settings': 'Settings'
    };
    
    // Check for exact match or partial match
    for (const [route, title] of Object.entries(pageTitles)) {
        if (pathname === route || pathname.startsWith(route.split(':')[0])) {
            return title;
        }
    }
    
    return `Welcome back, ${firstName}!`;
};

const Navbar = ({ onMenuClick, showSearch = true }) => {
    const { user } = useSelector((state) => state.auth);
    const { conversations } = useSelector((state) => state.chat);
    const { globalSearchQuery } = useSelector((state) => state.ui);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [anchorEl, setAnchorEl] = useState(null);
    const [searchQuery, setSearchQuery] = useState(globalSearchQuery);

    const totalUnreadMessages = conversations.reduce((acc, conv) => acc + (conv.unreadCount || 0), 0);

    const handleSearchChange = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        // Dispatch to Redux for global access
        dispatch(setGlobalSearchQuery(query));
    };

    const handleSearchKeyDown = (event) => {
        if (event.key === 'Enter') {
            dispatch(setGlobalSearchQuery(searchQuery));
        }
    };

    const handleSearchBlur = () => {
        // Update Redux state when user leaves the search field
        dispatch(setGlobalSearchQuery(searchQuery));
    };

    const handleProfileClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        dispatch(logoutUser());
        handleClose();
    };

    const handleChatClick = () => {
        dispatch(fetchConversations());
        navigate('/chat');
    };

    const handleProfileMenuClick = () => {
        handleClose();
        navigate('/doctor/profile');
    };

    const handleSettingsClick = () => {
        handleClose();
        navigate('/settings');
    };

    return (
        <AppBar 
            position="sticky" 
            elevation={0}
            sx={{ 
                bgcolor: "transparent", 
                color: "text.primary",
                py: 1
            }}
        >
            <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, md: 4 } }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={onMenuClick}
                        sx={{ display: { md: "none" } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    {/* Search Bar or Welcome Message */}
                    {showSearch ? (
                        <Paper
                            elevation={0}
                            sx={{
                                p: "2px 10px",
                                display: "flex",
                                alignItems: "center",
                                width: { xs: 150, sm: 300, md: 400 },
                                bgcolor: "rgba(255, 255, 255, 0.8)",
                                borderRadius: "15px",
                                border: "1px solid rgba(0,0,0,0.05)"
                            }}
                        >
                            <IconButton sx={{ p: "10px" }} aria-label="search">
                                <SearchIcon />
                            </IconButton>
                            <InputBase
                                sx={{ ml: 1, flex: 1, fontSize: "0.9rem" }}
                                placeholder="Search doctors, patients..."
                                inputProps={{ "aria-label": "search" }}
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onKeyDown={handleSearchKeyDown}
                                onBlur={handleSearchBlur}
                            />
                        </Paper>
                    ) : (
                        <Box sx={{ 
                            display: "flex", 
                            alignItems: "center",
                            width: { xs: 150, sm: 300, md: 400 },
                        }}>
                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    fontWeight: 600,
                                    color: "text.primary",
                                    display: { xs: "none", sm: "block" }
                                }}
                            >
                                {getPageTitle(location.pathname, user)}
                            </Typography>
                        </Box>
                    )}
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, md: 3 } }}>
                    {/* Icons */}
                    <IconButton 
                        onClick={handleChatClick}
                        sx={{ 
                            bgcolor: "white", 
                            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                            transition: "all 0.2s ease-in-out",
                            "&:hover": {
                                transform: "translateY(-2px)",
                                bgcolor: "rgba(255, 255, 255, 0.9)",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                            }
                        }}
                    >
                        <Badge badgeContent={totalUnreadMessages} color="error">
                            <MailIcon />
                        </Badge>
                    </IconButton>
                    
                    <NotificationBell />

                    {/* User Profile */}
                    <Box 
                        onClick={handleProfileClick}
                        sx={{ 
                            display: "flex", 
                            alignItems: "center", 
                            gap: 1.5, 
                            cursor: "pointer",
                            ml: 1,
                            p: 0.5,
                            pr: 1.5,
                            borderRadius: "30px",
                            transition: "0.2s",
                            "&:hover": { bgcolor: "rgba(0,0,0,0.03)" }
                        }}
                    >
                        <Avatar 
                            src={user?.avatar} 
                            alt={user?.fullName || user?.name}
                            sx={{ width: 40, height: 40, border: "2px solid white", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}
                        />
                        <Box sx={{ display: { xs: "none", sm: "block" } }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1 }}>
                                {user?.fullName || user?.name || "User"}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ textTransform: "capitalize" }}>
                                {user?.role || "Patient"}
                            </Typography>
                        </Box>
                        <ArrowDownIcon sx={{ fontSize: "1.2rem", color: "text.secondary" }} />
                    </Box>

                    {/* Profile Menu */}
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        transformOrigin={{ horizontal: "right", vertical: "top" }}
                        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                        PaperProps={{
                            sx: {
                                mt: 1.5,
                                borderRadius: 3,
                                boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                                minWidth: 200
                            }
                        }}
                    >
                        {/* Only show Profile menu item for doctors */}
                        {user?.role === ROLES.DOCTOR && (
                            <MenuItem onClick={handleProfileMenuClick}>
                                <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
                                Profile
                            </MenuItem>
                        )}
                        <MenuItem onClick={handleSettingsClick}>
                            <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
                            Account Settings
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
                            <ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
                            Logout
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
