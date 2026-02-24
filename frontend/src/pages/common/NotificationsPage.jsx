import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Container,
    Typography,
    Box,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Button,
    Chip,
    Divider,
    IconButton,
    CircularProgress,
    Tab,
    Tabs
} from "@mui/material";
import {
    Notifications as NotificationsIcon,
    Info as InfoIcon,
    CheckCircle as ReadIcon,
    NavigateBefore as BackIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { fetchNotifications, markAsRead, markAllNotificationsAsRead } from "../../features/notification/notificationSlice";

const NotificationsPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { notifications, isLoading, unreadCount } = useSelector((state) => state.notification);
    const [filter, setFilter] = useState(0); // 0: All, 1: Unread

    useEffect(() => {
        dispatch(fetchNotifications());
    }, [dispatch]);

    const handleMarkAsRead = (id) => {
        dispatch(markAsRead(id));
    };

    const handleMarkAll = () => {
        dispatch(markAllNotificationsAsRead());
    };

    const filteredNotifications = filter === 0 
        ? notifications 
        : notifications.filter(n => !n.isRead);

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
                <IconButton onClick={() => navigate(-1)} sx={{ bgcolor: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                    <BackIcon />
                </IconButton>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: "#1a237e" }}>
                        Notifications
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Stay updated with your latest activities and system alerts.
                    </Typography>
                </Box>
            </Box>

            <Paper elevation={0} sx={{ borderRadius: 4, border: "1px solid rgba(0,0,0,0.05)", overflow: "hidden" }}>
                <Box sx={{ px: 3, pt: 2, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
                    <Tabs value={filter} onChange={(e, val) => setFilter(val)} sx={{ "& .MuiTab-root": { fontWeight: 700, textTransform: "none", minWidth: 100 } }}>
                        <Tab label={`All (${notifications.length})`} />
                        <Tab label={`Unread (${unreadCount})`} />
                    </Tabs>
                    {unreadCount > 0 && (
                        <Button 
                            variant="text" 
                            startIcon={<ReadIcon />} 
                            onClick={handleMarkAll}
                            sx={{ fontWeight: 700, textTransform: "none" }}
                        >
                            Mark all as read
                        </Button>
                    )}
                </Box>
                <Divider />

                {isLoading ? (
                    <Box sx={{ py: 10, textAlign: "center" }}>
                        <CircularProgress />
                    </Box>
                ) : filteredNotifications.length > 0 ? (
                    <List sx={{ p: 0 }}>
                        {filteredNotifications.map((notification) => (
                            <ListItem 
                                key={notification.id} 
                                onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
                                sx={{ 
                                    py: 2.5,
                                    px: 3,
                                    cursor: notification.isRead ? "default" : "pointer", 
                                    bgcolor: notification.isRead ? "transparent" : "rgba(25, 118, 210, 0.04)",
                                    borderBottom: "1px solid rgba(0,0,0,0.05)",
                                    transition: "0.2s",
                                    "&:hover": { bgcolor: "rgba(0,0,0,0.02)" }
                                }}
                            >
                                <ListItemAvatar>
                                    <Avatar sx={{ 
                                        width: 48, 
                                        height: 48, 
                                        bgcolor: notification.isRead ? "grey.100" : "primary.light", 
                                        color: notification.isRead ? "grey.400" : "primary.main" 
                                    }}>
                                        <InfoIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText 
                                    primary={
                                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                            <Typography variant="body1" sx={{ fontWeight: notification.isRead ? 600 : 800, mb: 0.5 }}>
                                                {notification.title}
                                            </Typography>
                                            {!notification.isRead && <Chip label="New" size="small" color="primary" sx={{ height: 20, fontSize: "0.65rem", fontWeight: 900 }} />}
                                        </Box>
                                    }
                                    secondary={
                                        <Box>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, lineHeight: 1.6 }}>
                                                {notification.message}
                                            </Typography>
                                            <Typography variant="caption" sx={{ fontSize: "0.75rem", fontWeight: 600, color: "text.disabled" }}>
                                                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                            </Typography>
                                        </Box>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <Box sx={{ py: 12, textAlign: "center" }}>
                        <NotificationsIcon sx={{ fontSize: 60, color: "grey.300", mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 700 }}>
                            No notifications to show
                        </Typography>
                        <Typography variant="body2" color="text.disabled">
                            When you receive alerts or updates, they'll appear here.
                        </Typography>
                    </Box>
                )}
            </Paper>
        </Container>
    );
};

export default NotificationsPage;
