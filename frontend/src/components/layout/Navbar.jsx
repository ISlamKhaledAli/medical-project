import { useSelector, useDispatch } from "react-redux";
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
    ListItemIcon
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
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../features/auth/authSlice";
import NotificationBell from "./NotificationBell";

const Navbar = ({ onMenuClick }) => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);

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

    const handleProfileClickMenu = () => {
        handleClose();
        // Navigate to profile based on user role
        if (user?.role === 'doctor') {
            navigate('/doctor/profile');
        } else if (user?.role === 'patient') {
            navigate('/patient/profile');
        } else if (user?.role === 'admin') {
            navigate('/admin/dashboard');
        }
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

                    {/* Search Bar */}
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
                            placeholder="Search"
                            inputProps={{ "aria-label": "search" }}
                        />
                    </Paper>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, md: 3 } }}>
                    {/* Icons */}
                    <IconButton sx={{ bgcolor: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                        <MailIcon />
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
                        {user?.role === 'doctor' &&
                        <MenuItem onClick={handleProfileClickMenu}>
                            <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
                            Profile
                        </MenuItem>
                        }
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
