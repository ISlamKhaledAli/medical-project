import { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Box,
    Typography,
    TextField,
    IconButton,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemButton,
    Paper,
    Badge,
    InputAdornment,
    Divider,
    Chip,
    useMediaQuery,
    useTheme,
    alpha,
    Stack,
    Tooltip
} from "@mui/material";
import {
    Send,
    ChevronLeft,
    MessageSquare,
    Search,
    Phone,
    Video,
    MoreVertical,
    CheckCheck,
    Check,
    Clock,
    User,
    Sparkles,
    ShieldCheck
} from "lucide-react";
import { format, isToday, isYesterday } from "date-fns";
import useSocket from "../../hooks/useSocket";
import {
    fetchConversations,
    fetchMessages,
    markConversationRead,
    setActivePartner,
} from "../../features/chat/chatSlice";
import GlobalLoader from "../../components/ui/GlobalLoader";

const ChatPage = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const socket = useSocket();
    const socketRef = useRef(socket);
    socketRef.current = socket;

    const { user } = useSelector((state) => state.auth);
    const {
        conversations,
        messages,
        activePartnerId,
        isLoadingConversations,
        isLoadingMessages,
        typingUsers,
        currentPage,
        totalPages,
    } = useSelector((state) => state.chat);

    const [messageText, setMessageText] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [showConversations, setShowConversations] = useState(true);
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    useEffect(() => {
        dispatch(fetchConversations());
    }, [dispatch]);

    useEffect(() => {
        if (activePartnerId) {
            dispatch(fetchMessages({ partnerId: activePartnerId, page: 1 }));
            dispatch(markConversationRead(activePartnerId));
            if (socketRef.current) {
                socketRef.current.emit("markRead", { partnerId: activePartnerId });
            }
        }
    }, [activePartnerId, dispatch]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleSelectConversation = (partnerId) => {
        dispatch(setActivePartner(partnerId));
        if (isMobile) setShowConversations(false);
    };

    const handleSendMessage = useCallback(() => {
        if (!messageText.trim() || !activePartnerId || !socketRef.current) return;

        socketRef.current.emit("sendMessage", {
            receiverId: activePartnerId,
            text: messageText.trim(),
        });

        socketRef.current.emit("stopTyping", { receiverId: activePartnerId });
        setMessageText("");
    }, [messageText, activePartnerId]);

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleTyping = (e) => {
        setMessageText(e.target.value);
        if (!socketRef.current || !activePartnerId) return;

        socketRef.current.emit("typing", { receiverId: activePartnerId });

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            if (socketRef.current) socketRef.current.emit("stopTyping", { receiverId: activePartnerId });
        }, 1500);
    };

    const handleLoadMore = () => {
        if (currentPage < totalPages && activePartnerId) {
            dispatch(fetchMessages({ partnerId: activePartnerId, page: currentPage + 1 }));
        }
    };

    const activeConversation = conversations.find((c) => c.partnerId === activePartnerId);
    const filteredConversations = conversations.filter((c) =>
        c.partnerName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatMessageTime = (date) => {
        const d = new Date(date);
        if (isToday(d)) return format(d, "hh:mm a");
        if (isYesterday(d)) return "Yesterday " + format(d, "hh:mm a");
        return format(d, "MMM d, hh:mm a");
    };

    const formatConvTime = (date) => {
        if (!date) return "";
        const d = new Date(date);
        if (isToday(d)) return format(d, "hh:mm a");
        if (isYesterday(d)) return "Yesterday";
        return format(d, "MMM d");
    };

    const conversationListJSX = (
        <Paper
            elevation={0}
            sx={{
                width: isMobile ? "100%" : 380,
                height: "100%",
                borderRadius: 5,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                bgcolor: "background.paper",
                border: '1px solid',
                borderColor: 'divider'
            }}
        >
            <Box sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: "text.primary" }}>
                        Messenger
                    </Typography>
                    <Box sx={{ p: 0.5, borderRadius: 1.5, bgcolor: alpha(theme.palette.success.main, 0.1), color: 'success.main' }}>
                        <ShieldCheck size={18} />
                    </Box>
                </Stack>
                
                <TextField
                    fullWidth
                    placeholder="Search clinical contacts..."
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search size={18} color={theme.palette.text.disabled} />
                            </InputAdornment>
                        ),
                        sx: { borderRadius: 3, bgcolor: alpha(theme.palette.background.default, 0.8), border: 'none', '& fieldset': { border: 'none' } }
                    }}
                />
            </Box>

            <Divider sx={{ opacity: 0.6 }} />

            <List sx={{ flex: 1, overflow: "auto", p: 1.5 }}>
                {isLoadingConversations ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                        <GlobalLoader message="" />
                    </Box>
                ) : filteredConversations.length === 0 ? (
                    <Box sx={{ textAlign: "center", py: 10, px: 3 }}>
                        <MessageSquare size={48} color={theme.palette.text.disabled} style={{ opacity: 0.3, marginBottom: 16 }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "text.secondary" }}>
                            No active channels
                        </Typography>
                        <Typography variant="caption" sx={{ color: "text.disabled", display: 'block', mt: 1 }}>
                            Book an appointment or clinical consultation to initiate messaging.
                        </Typography>
                    </Box>
                ) : (
                    filteredConversations.map((conv) => (
                        <ListItem key={conv.partnerId} disablePadding sx={{ mb: 1 }}>
                            <ListItemButton
                                onClick={() => handleSelectConversation(conv.partnerId)}
                                selected={conv.partnerId === activePartnerId}
                                sx={{
                                    borderRadius: 4,
                                    py: 2,
                                    px: 2,
                                    transition: 'all 0.2s',
                                    "&.Mui-selected": {
                                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                                        "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.12) },
                                        border: '1px solid',
                                        borderColor: alpha(theme.palette.primary.main, 0.1)
                                    },
                                    "&:hover": { bgcolor: alpha(theme.palette.text.primary, 0.03) },
                                    border: '1px solid transparent'
                                }}
                            >
                                <ListItemAvatar>
                                    <Badge
                                        badgeContent={conv.unreadCount || 0}
                                        color="error"
                                        overlap="circular"
                                        sx={{ '& .MuiBadge-badge': { fontWeight: 900, fontSize: 10, minWidth: 20, height: 20 } }}
                                    >
                                        <Avatar
                                            sx={{
                                                bgcolor: conv.partnerRole === "doctor" ? "primary.main" : "secondary.main",
                                                width: 52,
                                                height: 52,
                                                fontWeight: 900,
                                                fontSize: 18,
                                                border: '2px solid white',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                            }}
                                        >
                                            {conv.partnerName?.charAt(0)?.toUpperCase()}
                                        </Avatar>
                                    </Badge>
                                </ListItemAvatar>
                                <ListItemText
                                    sx={{ ml: 1 }}
                                    primary={
                                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                                            <Typography
                                                variant="subtitle2"
                                                sx={{
                                                    fontWeight: conv.unreadCount ? 900 : 700,
                                                    color: "text.primary",
                                                    maxWidth: 140,
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                {conv.partnerName}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: "text.disabled", fontWeight: 700 }}>
                                                {formatConvTime(conv.lastMessage?.createdAt)}
                                            </Typography>
                                        </Box>
                                    }
                                    secondary={
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: conv.unreadCount ? "primary.main" : "text.secondary",
                                                fontWeight: conv.unreadCount ? 800 : 500,
                                                maxWidth: 180,
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                                display: 'block'
                                            }}
                                        >
                                            {conv.lastMessage?.text || "Synchronizing data..."}
                                        </Typography>
                                    }
                                />
                            </ListItemButton>
                        </ListItem>
                    ))
                )}
            </List>
        </Paper>
    );

    const messageAreaJSX = (
        <Paper
            elevation={0}
            sx={{
                flex: 1,
                height: "100%",
                borderRadius: 5,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                bgcolor: "background.paper",
                ml: isMobile ? 0 : 3,
                border: '1px solid',
                borderColor: 'divider'
            }}
        >
            {!activePartnerId ? (
                <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", p: 4 }}>
                    <Box sx={{ width: 120, height: 120, borderRadius: '40%', bgcolor: alpha(theme.palette.primary.main, 0.05), display: "flex", alignItems: "center", justifyContent: "center", mb: 4 }}>
                        <Sparkles size={48} color={theme.palette.primary.main} />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 900, mb: 1.5 }}>Secure Clinical Messenger</Typography>
                    <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ maxWidth: 320, fontWeight: 500, lineHeight: 1.6 }}>
                        Select a clinical partner or patient to initiate a secure, encrypted communication session. 
                    </Typography>
                </Box>
            ) : (
                <>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, px: 3, py: 2.5, borderBottom: "1px solid", borderColor: 'divider', bgcolor: alpha(theme.palette.background.default, 0.5) }}>
                        {isMobile && (
                            <IconButton onClick={() => { setShowConversations(true); dispatch(setActivePartner(null)); }} size="small">
                                <ChevronLeft size={20} />
                            </IconButton>
                        )}
                        <Avatar sx={{ bgcolor: activeConversation?.partnerRole === "doctor" ? "primary.main" : "secondary.main", width: 48, height: 48, fontWeight: 900, border: '2px solid white', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                            {activeConversation?.partnerName?.charAt(0)?.toUpperCase()}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
                                {activeConversation?.partnerName}
                            </Typography>
                            {typingUsers[activePartnerId] ? (
                                <Typography variant="caption" sx={{ color: "success.main", fontWeight: 800, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <span className="typing-dot">.</span><span className="typing-dot">.</span><span className="typing-dot">.</span> typing clinical response
                                </Typography>
                            ) : (
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main', boxShadow: `0 0 8px ${theme.palette.success.main}` }} />
                                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                        {activeConversation?.partnerRole === "doctor" ? "Medical Specialist" : "Patient File"}
                                    </Typography>
                                </Stack>
                            )}
                        </Box>
                        <Stack direction="row" spacing={1}>
                            <Tooltip title="Audio Consultation"><IconButton size="small" sx={{ color: 'text.secondary' }}><Phone size={20} /></IconButton></Tooltip>
                            <Tooltip title="Video Consultation"><IconButton size="small" sx={{ color: 'text.secondary' }}><Video size={20} /></IconButton></Tooltip>
                            <Tooltip title="Clinical Options"><IconButton size="small" sx={{ color: 'text.secondary' }}><MoreVertical size={20} /></IconButton></Tooltip>
                        </Stack>
                    </Box>

                    <Box
                        ref={messagesContainerRef}
                        sx={{
                            flex: 1,
                            overflow: "auto",
                            px: 4,
                            py: 3,
                            bgcolor: alpha(theme.palette.background.default, 0.3),
                            display: "flex",
                            flexDirection: "column",
                            gap: 1.5,
                        }}
                    >
                        {currentPage < totalPages && (
                            <Box sx={{ textAlign: "center", mb: 2 }}>
                                <Button size="small" variant="soft" onClick={handleLoadMore} sx={{ borderRadius: 2, fontWeight: 800, textTransform: 'none' }}>
                                    Retroactive Sync (Load Older)
                                </Button>
                            </Box>
                        )}

                        {isLoadingMessages && currentPage === 1 ? (
                            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}><GlobalLoader message="" /></Box>
                        ) : messages.length === 0 ? (
                            <Box sx={{ textAlign: "center", py: 8 }}>
                                <Typography variant="caption" sx={{ fontWeight: 700, p: 2, borderRadius: 2, bgcolor: alpha(theme.palette.info.main, 0.05), color: 'info.main' }}>
                                    Establishing secure channel. Send a message to begin.
                                </Typography>
                            </Box>
                        ) : (
                            messages.map((msg, idx) => {
                                const isMine = (msg.sender?._id || msg.sender) === user?._id;
                                const isFirstInGroup = idx === 0 || (messages[idx-1]?.sender?._id || messages[idx-1]?.sender) !== (msg.sender?._id || msg.sender);
                                
                                return (
                                    <Box key={msg._id || idx} sx={{ display: "flex", justifyContent: isMine ? "flex-end" : "flex-start", mt: isFirstInGroup ? 2 : 0 }}>
                                        {!isMine && isFirstInGroup && (
                                            <Avatar sx={{ width: 32, height: 32, fontSize: 12, mr: 1.5, mt: 0.5, bgcolor: 'secondary.main', fontWeight: 900 }}>
                                                {activeConversation?.partnerName?.[0]}
                                            </Avatar>
                                        )}
                                        <Box sx={{ 
                                            maxWidth: "75%", 
                                            px: 3, 
                                            py: 2, 
                                            borderRadius: isMine ? "24px 24px 4px 24px" : "24px 24px 24px 4px", 
                                            bgcolor: isMine ? "primary.main" : "white", 
                                            color: isMine ? "white" : "text.primary",
                                            boxShadow: isMine ? `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}` : "0 2px 8px rgba(0,0,0,0.04)",
                                            ml: !isMine && !isFirstInGroup ? 6 : 0
                                        }}>
                                            <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: 1.6, wordBreak: "break-word" }}>
                                                {msg.text}
                                            </Typography>
                                            <Stack direction="row" spacing={0.5} justifyContent="flex-end" alignItems="center" sx={{ mt: 0.5, opacity: 0.7 }}>
                                                <Typography variant="caption" sx={{ fontSize: 9, fontWeight: 700 }}>
                                                    {formatMessageTime(msg.createdAt)}
                                                </Typography>
                                                {isMine && <CheckCheck size={12} />}
                                            </Stack>
                                        </Box>
                                    </Box>
                                );
                            })
                        )}
                        <div ref={messagesEndRef} />
                    </Box>

                    <Box sx={{ p: 3, borderTop: "1px solid", borderColor: 'divider', bgcolor: 'white' }}>
                        <Stack direction="row" spacing={2} alignItems="flex-end">
                            <TextField
                                fullWidth
                                multiline
                                maxRows={4}
                                placeholder="Consultation notes or inquiry..."
                                value={messageText}
                                onChange={handleTyping}
                                onKeyDown={handleKeyDown}
                                InputProps={{
                                    sx: { borderRadius: 4, bgcolor: alpha(theme.palette.background.default, 0.8), border: 'none', '& fieldset': { border: 'none' }, py: 1.5, px: 2.5 }
                                }}
                            />
                            <IconButton
                                onClick={handleSendMessage}
                                disabled={!messageText.trim()}
                                sx={{
                                    bgcolor: "primary.main",
                                    color: "white",
                                    width: 54,
                                    height: 54,
                                    borderRadius: 3.5,
                                    boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.25)}`,
                                    "&:hover": { bgcolor: "primary.dark", transform: 'translateY(-2px)' },
                                    "&.Mui-disabled": { bgcolor: "divider", color: "white", boxShadow: 'none' },
                                    transition: 'all 0.2s'
                                }}
                            >
                                <Send size={24} />
                            </IconButton>
                        </Stack>
                    </Box>
                </>
            )}
        </Paper>
    );

    return (
        <Box sx={{ height: "calc(100vh - 120px)", display: "flex", p: isMobile ? 1 : 0 }}>
            {isMobile ? (showConversations ? conversationListJSX : messageAreaJSX) : (
                <> {conversationListJSX} {messageAreaJSX} </>
            )}
        </Box>
    );
};

export default ChatPage;
