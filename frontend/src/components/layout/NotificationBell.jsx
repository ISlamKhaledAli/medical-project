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
    Avatar
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
                        width: 320,
                        maxHeight: 450,
                        borderRadius: 3,
                        mt: 1.5,
                        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                        overflow: "hidden"
                    }
                }}
            >
                <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>Notifications</Typography>
                    <Typography 
                        variant="caption" 
                        sx={{ fontWeight: 700, color: "primary.main", cursor: "pointer" }}
                        onClick={handleMarkAll}
                    >
                        Mark all as read
                    </Typography>
                </Box>
                <Divider />
                
                <List sx={{ p: 0 }}>
                    {notifications.slice(0, 5).length > 0 ? (
                        notifications.slice(0, 5).map((notification) => (
                            <ListItem 
                                key={notification._id || notification.id} 
                                onClick={() => handleMarkAsRead(notification._id || notification.id)}
                                sx={{ 
                                    cursor: "pointer", 
                                    bgcolor: notification.isRead ? "transparent" : "rgba(25, 118, 210, 0.04)",
                                    borderBottom: "1px solid rgba(0,0,0,0.05)",
                                    "&:hover": { bgcolor: "rgba(0,0,0,0.02)" }
                                }}
                            >
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: notification.isRead ? "grey.200" : "primary.main", color: notification.isRead ? "grey.500" : "white" }}>
                                        <InfoIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText 
                                    primary={notification.type ? notification.type.charAt(0).toUpperCase() + notification.type.slice(1) : "Notification"}
                                    secondary={
                                        <>
                                            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                                                {notification.message}
                                            </Typography>
                                            <Typography variant="caption" sx={{ fontSize: "0.7rem", fontWeight: 600 }}>
                                                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                            </Typography>
                                        </>
                                    }
                                    primaryTypographyProps={{ variant: "body2", fontWeight: notification.isRead ? 500 : 800 }}
                                />
                            </ListItem>
                        ))
                    ) : (
                        <Box sx={{ py: 6, textAlign: "center" }}>
                            <Typography color="text.secondary">No notifications yet.</Typography>
                        </Box>
                    )}
                </List>

                {notifications.length > 0 && (
                    <Box sx={{ p: 1.5, textAlign: "center", bgcolor: "rgba(0,0,0,0.02)" }}>
                        <Typography 
                            variant="caption" 
                            sx={{ fontWeight: 700, color: "text.secondary", cursor: "pointer" }}
                            onClick={handleViewAll}
                        >
                            View All Notifications
                        </Typography>
                    </Box>
                )}
            </Menu>
        </>
    );
};

export default NotificationBell;
