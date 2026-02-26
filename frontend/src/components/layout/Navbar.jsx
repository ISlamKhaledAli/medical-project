import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
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
    Badge,
    alpha,
    useTheme
} from "@mui/material";
import { 
    Search as SearchIcon, 
    Mail as MailIcon,
    Menu as MenuIcon,
    ChevronDown as ArrowDownIcon,
    LogOut as LogoutIcon,
    User as PersonIcon,
    Settings as SettingsIcon
} from "lucide-react";
import { useState } from "react";
import { logoutUser } from "../../features/auth/authSlice";
import NotificationBell from "./NotificationBell";

const Navbar = ({ onMenuClick }) => {
    const { user } = useSelector((state) => state.auth);
    const { conversations } = useSelector((state) => state.chat);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState(null);

    const totalUnreadMessages = conversations.reduce((acc, conv) => acc + (conv.unreadCount || 0), 0);

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

    const handleChatClick = () => {
        const path = user?.role === 'doctor' ? '/doctor/chat' : user?.role === 'admin' ? '/admin/dashboard' : '/patient/chat';
        navigate(path);
    };

    return (
        <AppBar 
            position="sticky" 
            elevation={0}
            sx={{ 
                bgcolor: alpha("#fff", 0.7), 
                color: "text.primary",
                backdropFilter: "blur(12px)",
                borderBottom: "1px solid",
                borderColor: "divider",
                zIndex: (theme) => theme.zIndex.drawer + 1,
                top: 0
            }}
        >
            <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, md: 4 }, minHeight: { xs: 70, md: 80 } }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={onMenuClick}
                        sx={{ display: { md: "none" } }}
                    >
                        <MenuIcon size={24} />
                    </IconButton>

                    {/* Search Bar */}
                    <Box sx={{ display: { xs: "none", sm: "block" } }}>
                      <Paper
                          elevation={0}
                          sx={{
                              p: "2px 12px",
                              display: "flex",
                              alignItems: "center",
                              width: { sm: 250, md: 350 },
                              bgcolor: alpha(theme.palette.background.default, 0.8),
                              borderRadius: "12px",
                              border: "1.5px solid",
                              borderColor: "transparent",
                              transition: "all 0.2s ease",
                              "&:focus-within": {
                                borderColor: "primary.main",
                                bgcolor: "#fff",
                                boxShadow: "0 4px 12px rgba(21, 101, 192, 0.08)"
                              }
                          }}
                      >
                          <SearchIcon size={18} color={theme.palette.text.secondary} />
                          <InputBase
                              sx={{ ml: 1.5, flex: 1, fontSize: "0.9rem", fontWeight: 500 }}
                              placeholder="Search anything..."
                              inputProps={{ "aria-label": "search" }}
                          />
                      </Paper>
                    </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, md: 2.5 } }}>
                    {/* Icons */}
                    <IconButton 
                        onClick={handleChatClick}
                        sx={{ 
                            bgcolor: "rgba(0,0,0,0.02)", 
                            transition: "all 0.2s ease",
                            "&:hover": {
                                bgcolor: "primary.light",
                                color: "primary.main",
                                transform: "translateY(-1px)"
                            }
                        }}
                    >
                        <Badge badgeContent={totalUnreadMessages} color="error" overlap="circular">
                            <MailIcon size={20} />
                        </Badge>
                    </IconButton>
                    
                    <NotificationBell />

                    <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 24, alignSelf: "center", display: { xs: "none", sm: "block" } }} />

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
                            pr: 1,
                            borderRadius: "12px",
                            transition: "0.2s",
                            "&:hover": { bgcolor: "rgba(0,0,0,0.03)" }
                        }}
                    >
                        <Avatar 
                            src={user?.avatar} 
                            alt={user?.fullName || user?.name}
                            sx={{ 
                              width: 38, 
                              height: 38, 
                              border: "2px solid #fff", 
                              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                              fontWeight: 800,
                              bgcolor: "primary.main"
                            }}
                        >
                          {user?.fullName?.[0] || user?.name?.[0] || "U"}
                        </Avatar>
                        <Box sx={{ display: { xs: "none", md: "block" } }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, lineHeight: 1.2, color: "text.primary" }}>
                                {user?.fullName || user?.name || "User"}
                            </Typography>
                            <Typography variant="caption" sx={{ textTransform: "uppercase", fontWeight: 700, letterSpacing: 1, color: "primary.main", fontSize: "0.65rem" }}>
                                {user?.role || "Patient"}
                            </Typography>
                        </Box>
                        <ArrowDownIcon size={16} color={theme.palette.text.secondary} />
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
                                boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
                                minWidth: 220,
                                p: 1,
                                border: "1px solid",
                                borderColor: "divider"
                            }
                        }}
                    >
                        <MenuItem onClick={handleProfileClickMenu} sx={{ borderRadius: 2, mb: 0.5, py: 1.2 }}>
                            <ListItemIcon><PersonIcon size={18} /></ListItemIcon>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>My Profile</Typography>
                        </MenuItem>
                        <MenuItem onClick={handleSettingsClick} sx={{ borderRadius: 2, mb: 0.5, py: 1.2 }}>
                            <ListItemIcon><SettingsIcon size={18} /></ListItemIcon>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>Preferences</Typography>
                        </MenuItem>
                        <Divider sx={{ my: 1, opacity: 0.6 }} />
                        <MenuItem onClick={handleLogout} sx={{ color: "error.main", borderRadius: 2, py: 1.2 }}>
                            <ListItemIcon><LogoutIcon size={18} color={theme.palette.error.main} /></ListItemIcon>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>Logout Session</Typography>
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;

