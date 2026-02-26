import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
    IconButton, 
    Badge, 
    Menu, 
    MenuItem, 
    Typography, 
    Box, 
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Button,
    alpha,
    useTheme
} from "@mui/material";
import { Notifications as NotificationsIcon, Info as InfoIcon } from "@mui/icons-material";
import { fetchNotifications, markAsRead, markAllNotificationsAsRead } from "../../features/notification/notificationSlice";
import { formatDistanceToNow } from "date-fns";

const NotificationBell = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { notifications, unreadCount } = useSelector((state) => state.notification);
    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
        dispatch(fetchNotifications());
    }, [dispatch]);

    const handleOpen = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const handleMarkAsRead = (id) => {
        dispatch(markAsRead(id));
    };

    const handleMarkAll = () => {
        dispatch(markAllNotificationsAsRead());
    };

    const handleViewAll = () => {
        handleClose();
        navigate("/notifications");
    };

    return (
        <>
            <IconButton color="inherit" onClick={handleOpen}>
                <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                TransitionProps={{ timeout: 400 }}
                PaperProps={{
                    sx: {
                        width: 380,
                        maxHeight: 520,
                        borderRadius: "16px",
                        mt: 2,
                        boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
                        border: "1px solid",
                        borderColor: "divider",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden"
                    }
                }}
            >
                <Box sx={{ p: 2.5, px: 3, display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "white", position: "sticky", top: 0, zIndex: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "text.primary" }}>Notifications</Typography>
                    <Typography 
                        variant="caption" 
                        sx={{ 
                            fontWeight: 700, 
                            color: "primary.main", 
                            cursor: "pointer",
                            px: 1.5,
                            py: 0.5,
                            borderRadius: "12px",
                            transition: "0.2s",
                            "&:hover": { 
                                bgcolor: alpha(theme.palette.primary.main, 0.08),
                                textDecoration: "none" 
                            }
                        }}
                        onClick={handleMarkAll}
                    >
                        Mark all as read
                    </Typography>
                </Box>
                <Divider />
                
                <Box sx={{ 
                    overflowY: "auto", 
                    flexGrow: 1, 
                    maxHeight: 400,
                    '&::-webkit-scrollbar': { width: '6px' },
                    '&::-webkit-scrollbar-thumb': { bgcolor: alpha(theme.palette.divider, 0.5), borderRadius: '10px' },
                }}>
                    <List sx={{ p: 0 }}>
                        {notifications.length > 0 ? (
                            notifications.slice(0, 10).map((notification) => (
                                <ListItem 
                                    key={notification._id || notification.id} 
                                    onClick={() => handleMarkAsRead(notification._id || notification.id)}
                                    sx={{ 
                                        py: 2.5,
                                        px: 3,
                                        cursor: "pointer", 
                                        bgcolor: notification.isRead ? "transparent" : alpha(theme.palette.primary.main, 0.02),
                                        borderBottom: "1px solid",
                                        borderColor: "rgba(0,0,0,0.03)",
                                        transition: "all 0.2s ease",
                                        position: "relative",
                                        "&:hover": { 
                                            bgcolor: alpha(theme.palette.primary.main, 0.04),
                                            "& .MuiAvatar-root": { transform: "scale(1.05)" }
                                        }
                                    }}
                                >
                                    {!notification.isRead && (
                                        <Box sx={{ 
                                            position: "absolute", 
                                            left: 10, 
                                            top: "50%", 
                                            transform: "translateY(-50%)",
                                            width: 8,
                                            height: 8,
                                            borderRadius: "50%",
                                            bgcolor: "primary.main",
                                            boxShadow: `0 0 10px ${alpha(theme.palette.primary.main, 0.5)}`
                                        }} />
                                    )}
                                    <ListItemAvatar>
                                        <Avatar sx={{ 
                                            width: 44, 
                                            height: 44, 
                                            bgcolor: notification.isRead ? alpha(theme.palette.text.disabled, 0.1) : alpha(theme.palette.primary.main, 0.1), 
                                            color: notification.isRead ? "text.disabled" : "primary.main",
                                            transition: "0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                                        }}>
                                            <InfoIcon fontSize="small" />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText 
                                        primary={notification.type ? notification.type.charAt(0).toUpperCase() + notification.type.slice(1) : "Notification"}
                                        secondary={
                                            <Box>
                                                <Typography variant="body2" color="text.secondary" sx={{ display: "block", mt: 0.5, mb: 0.8, fontSize: "0.85rem", lineHeight: 1.5, fontWeight: 400 }}>
                                                    {notification.message}
                                                </Typography>
                                                <Typography variant="caption" sx={{ fontSize: "0.7rem", fontWeight: 600, color: "text.disabled", display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <Box component="span" sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'currentColor', opacity: 0.5 }} />
                                                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                                </Typography>
                                            </Box>
                                        }
                                        primaryTypographyProps={{ variant: "body2", fontWeight: 700, color: "text.primary" }}
                                        secondaryTypographyProps={{ component: 'div' }}
                                    />
                                </ListItem>
                            ))
                        ) : (
                            <Box sx={{ py: 10, textAlign: "center", opacity: 0.5 }}>
                                <NotificationsIcon sx={{ fontSize: 48, color: "grey.300", mb: 2 }} />
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>No current notifications</Typography>
                            </Box>
                        )}
                    </List>
                </Box>

                <Box sx={{ p: 2, px: 3, display: "flex", justifyContent: "center", bgcolor: "white", borderTop: "1px solid", borderColor: "divider" }}>
                    <Button 
                        fullWidth
                        size="medium"
                        onClick={handleViewAll}
                        sx={{ 
                            py: 1,
                            fontSize: "0.8rem",
                            fontWeight: 800, 
                            textTransform: "none",
                            borderRadius: "12px",
                            color: "primary.main",
                            bgcolor: alpha(theme.palette.primary.main, 0.04),
                            "&:hover": {
                                bgcolor: alpha(theme.palette.primary.main, 0.08),
                                transform: "translateY(-1px)"
                            },
                            transition: "all 0.2s"
                        }}
                    >
                        See All Activity
                    </Button>
                </Box>
            </Menu>
        </>
    );
};

export default NotificationBell;
