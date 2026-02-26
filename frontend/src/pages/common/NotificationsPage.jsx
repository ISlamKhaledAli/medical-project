import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Typography,
    Box,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Button,
    Chip,
    Divider,
    IconButton,
    Tabs,
    Tab,
    alpha,
    useTheme,
    Stack,
    Paper,
    Tooltip,
    Grid
} from "@mui/material";
import {
    Bell,
    Info,
    CheckCircle2,
    Clock,
    Trash2,
    ChevronLeft,
    Check,
    AlertCircle,
    Calendar,
    MessageSquare,
    Sparkles
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { fetchNotifications, markAsRead, markAllNotificationsAsRead } from "../../features/notification/notificationSlice";
import PageHeader from "../../components/ui/PageHeader";
import SectionCard from "../../components/ui/SectionCard";
import GlobalLoader from "../../components/ui/GlobalLoader";
import EmptyState from "../../components/ui/EmptyState";

const NotificationsPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme();
    const { notifications, isLoading, unreadCount } = useSelector((state) => state.notification);
    const [filter, setFilter] = useState(0);

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

    const getIcon = (type) => {
        switch(type) {
            case 'appointment': return <Calendar size={20} />;
            case 'chat': return <MessageSquare size={20} />;
            case 'system': return <Sparkles size={20} />;
            default: return <Info size={20} />;
        }
    };

    const getColor = (type) => {
        switch(type) {
            case 'appointment': return 'primary';
            case 'chat': return 'info';
            case 'system': return 'warning';
            default: return 'secondary';
        }
    };

    if (isLoading && notifications.length === 0) return <GlobalLoader message="Syncing communications..." />;

    return (
        <Box>
            <PageHeader 
                title="Activity Feed"
                subtitle="Centralized management of your clinical alerts, patient requests, and system updates."
                breadcrumbs={[
                    { label: "Platform", path: "/" },
                    { label: "Notifications", active: true }
                ]}
                action={{
                    label: "Return",
                    icon: ChevronLeft,
                    onClick: () => navigate(-1)
                }}
            />

            <Grid container spacing={4}>
                <Grid size={{ xs: 12, lg: 8 }}>
                    <SectionCard 
                        title="Notifications" 
                        subtitle={`${unreadCount} unread transmissions`}
                        headerAction={
                            unreadCount > 0 && (
                                <Button 
                                    size="small"
                                    startIcon={<CheckCircle2 size={16} />} 
                                    onClick={handleMarkAll}
                                    sx={{ fontWeight: 800, textTransform: 'none', borderRadius: 2 }}
                                >
                                    Mark all as resolved
                                </Button>
                            )
                        }
                    >
                        <Box sx={{ mb: 3 }}>
                            <Tabs 
                                value={filter} 
                                onChange={(e, val) => setFilter(val)} 
                                sx={{ 
                                    minHeight: 48,
                                    '& .MuiTabs-indicator': { height: 3, borderRadius: '3px 3px 0 0' },
                                    '& .MuiTab-root': { textTransform: 'none', fontWeight: 800, fontSize: '0.9rem', minWidth: 120 }
                                }}
                            >
                                <Tab label={`Scope: All (${notifications.length})`} />
                                <Tab label={`Scope: Unread (${unreadCount})`} />
                            </Tabs>
                        </Box>

                        {filteredNotifications.length > 0 ? (
                            <List sx={{ p: 0 }}>
                                {filteredNotifications.map((notification, idx) => (
                                    <ListItem 
                                        key={notification.id || idx} 
                                        onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
                                        sx={{ 
                                            py: 3,
                                            px: 2,
                                            borderRadius: 4,
                                            mb: 1.5,
                                            cursor: notification.isRead ? "default" : "pointer", 
                                            bgcolor: notification.isRead ? "transparent" : alpha(theme.palette.primary.main, 0.03),
                                            border: '1px solid',
                                            borderColor: notification.isRead ? alpha(theme.palette.divider, 0.5) : alpha(theme.palette.primary.main, 0.1),
                                            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                                            "&:hover": { 
                                                bgcolor: alpha(theme.palette.background.default, 0.8),
                                                borderColor: theme.palette.primary.main,
                                                transform: 'translateX(4px)'
                                            }
                                        }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar sx={{ 
                                                width: 52, 
                                                height: 52, 
                                                borderRadius: 2.5,
                                                bgcolor: notification.isRead ? alpha(theme.palette.text.disabled, 0.1) : alpha(theme.palette[getColor(notification.type)].main, 0.1), 
                                                color: notification.isRead ? 'text.disabled' : `${getColor(notification.type)}.main` 
                                            }}>
                                                {getIcon(notification.type)}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText 
                                            sx={{ ml: 1 }}
                                            primary={
                                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: notification.isRead ? 700 : 900, mb: 0.5, color: notification.isRead ? 'text.secondary' : 'text.primary' }}>
                                                        {notification.title}
                                                    </Typography>
                                                    {!notification.isRead && (
                                                        <Chip 
                                                            label="Urgent" 
                                                            size="small" 
                                                            color="primary" 
                                                            sx={{ 
                                                                height: 20, 
                                                                fontSize: "0.6rem", 
                                                                fontWeight: 900, 
                                                                textTransform: 'uppercase',
                                                                borderRadius: 1
                                                            }} 
                                                        />
                                                    )}
                                                </Box>
                                            }
                                            secondary={
                                                <Box>
                                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500, lineHeight: 1.5 }}>
                                                        {notification.message}
                                                    </Typography>
                                                    <Stack direction="row" spacing={2} alignItems="center">
                                                        <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.disabled', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                            <Clock size={12} />
                                                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                                        </Typography>
                                                        {notification.isRead ? (
                                                            <Typography variant="caption" sx={{ fontWeight: 800, color: 'success.main', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                                <Check size={12} /> Resolved
                                                            </Typography>
                                                        ) : (
                                                            <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.main' }}>
                                                                Action Required
                                                            </Typography>
                                                        )}
                                                    </Stack>
                                                </Box>
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Box sx={{ py: 12 }}>
                                <EmptyState 
                                    title="Operational Clarity"
                                    message="Your feed is currently synchronized. No new transmissions detected."
                                    icon={Bell}
                                />
                            </Box>
                        )}
                    </SectionCard>
                </Grid>

                <Grid size={{ xs: 12, lg: 4 }}>
                    <Stack spacing={3}>
                        <SectionCard title="System Integrity" icon={AlertCircle}>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, lineHeight: 1.6, mb: 3 }}>
                                Our platform employs real-time auditing. All communications are encrypted and synchronized across your clinical devices.
                            </Typography>
                            <Stack spacing={2}>
                                {[
                                    { label: 'Unread Critical', value: unreadCount, color: 'error' },
                                    { label: 'Platform Health', value: 'Optimal', color: 'success' },
                                    { label: 'Sync Status', value: 'Live', color: 'info' }
                                ].map((stat, i) => (
                                    <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderRadius: 3, bgcolor: alpha(theme.palette[stat.color].main, 0.04), border: '1px solid', borderColor: alpha(theme.palette[stat.color].main, 0.1) }}>
                                        <Typography variant="caption" sx={{ fontWeight: 800 }}>{stat.label}</Typography>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 900, color: `${stat.color}.main` }}>{stat.value}</Typography>
                                    </Box>
                                ))}
                            </Stack>
                        </SectionCard>

                        <Paper 
                            sx={{ 
                                p: 3, 
                                borderRadius: 5, 
                                bgcolor: 'primary.main', 
                                color: 'white',
                                textAlign: 'center',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            <Box sx={{ position: 'relative', zIndex: 1 }}>
                                <Sparkles size={32} style={{ marginBottom: 12 }} />
                                <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 0.5 }}>Smart Priorities</Typography>
                                <Typography variant="caption" sx={{ opacity: 0.8, display: 'block' }}>
                                    Clinical alerts are prioritized to ensure immediate patient care.
                                </Typography>
                            </Box>
                        </Paper>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
};

export default NotificationsPage;
