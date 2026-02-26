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
    Button
} from "@mui/material";
import { Notifications as NotificationsIcon, Info as InfoIcon } from "@mui/icons-material";
import { fetchNotifications, markAsRead, markAllNotificationsAsRead } from "../../features/notification/notificationSlice";
import { formatDistanceToNow } from "date-fns";

const NotificationBell = () => {
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
                PaperProps={{
                    sx: {
                        width: 330, // Slightly wider
                        maxHeight: 500, // Increased height
                        borderRadius: 4, // More rounded
                        mt: 1.5,
                        boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden" // Keep this, but we'll scroll the content
                    }
                }}
            >
                <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "white", position: "sticky", top: 0, zIndex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 900 }}>Notifications</Typography>
                    <Typography 
                        variant="caption" 
                        sx={{ 
                            fontWeight: 700, 
                            color: "primary.main", 
                            cursor: "pointer",
                            "&:hover": { textDecoration: "underline" }
                        }}
                        onClick={handleMarkAll}
                    >
                        Mark all as read
                    </Typography>
                </Box>
                <Divider />
                
                <Box sx={{ overflowY: "auto", flexGrow: 1, maxHeight: 380 }}>
                    <List sx={{ p: 0 }}>
                        {notifications.length > 0 ? (
                            notifications.slice(0, 5).map((notification) => (
                                <ListItem 
                                    key={notification._id || notification.id} 
                                    onClick={() => handleMarkAsRead(notification._id || notification.id)}
                                    sx={{ 
                                        py: 2,
                                        px: 2,
                                        cursor: "pointer", 
                                        bgcolor: notification.isRead ? "transparent" : "rgba(25, 118, 210, 0.04)",
                                        borderBottom: "1px solid rgba(0,0,0,0.05)",
                                        "&:hover": { bgcolor: "rgba(0,0,0,0.02)" }
                                    }}
                                >
                                    <ListItemAvatar>
                                        <Avatar sx={{ 
                                            width: 40, 
                                            height: 40, 
                                            bgcolor: notification.isRead ? "grey.100" : "primary.light", 
                                            color: notification.isRead ? "grey.400" : "primary.main" 
                                        }}>
                                            <InfoIcon fontSize="small" />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText 
                                        primary={notification.type ? notification.type.charAt(0).toUpperCase() + notification.type.slice(1) : "Notification"}
                                        secondary={
                                            <Box>
                                                <Typography variant="body2" color="text.secondary" sx={{ display: "block", mb: 0.5, fontSize: "0.8rem", lineHeight: 1.4 }}>
                                                    {notification.message}
                                                </Typography>
                                                <Typography variant="caption" sx={{ fontSize: "0.65rem", fontWeight: 700, color: "text.disabled" }}>
                                                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                                </Typography>
                                            </Box>
                                        }
                                        primaryTypographyProps={{ variant: "body2", fontWeight: notification.isRead ? 600 : 800 }}
                                    />
                                </ListItem>
                            ))
                        ) : (
                            <Box sx={{ py: 6, textAlign: "center" }}>
                                <NotificationsIcon sx={{ fontSize: 40, color: "grey.200", mb: 1 }} />
                                <Typography variant="body2" color="text.disabled">No notifications yet.</Typography>
                            </Box>
                        )}
                    </List>
                </Box>

                <Box sx={{ p: 1.5, display: "flex", justifyContent: "center", bgcolor: "white" }}>
                    <Button 
                        size="small"
                        onClick={handleViewAll}
                        sx={{ 
                            px: 3,
                            py: 0.5,
                            fontSize: "0.75rem",
                            fontWeight: 700, 
                            textTransform: "none",
                            borderRadius: "20px",
                            color: "primary.main",
                            bgcolor: "rgba(25, 118, 210, 0.05)",
                            "&:hover": {
                                bgcolor: "rgba(25, 118, 210, 0.1)",
                                transform: "translateY(-1px)"
                            },
                            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                        }}
                    >
                        View All Notifications
                    </Button>
                </Box>
            </Menu>
        </>
    );
};

export default NotificationBell;
