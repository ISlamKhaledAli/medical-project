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
    CircularProgress,
    Divider,
    Chip,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import {
    Send as SendIcon,
    ArrowBack as ArrowBackIcon,
    Chat as ChatIcon,
    Search as SearchIcon,
} from "@mui/icons-material";
import { format, isToday, isYesterday } from "date-fns";
import useSocket from "../../hooks/useSocket";
import {
    fetchConversations,
    fetchMessages,
    markConversationRead,
    setActivePartner,
} from "../../features/chat/chatSlice";

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

    // Load conversations on mount
    useEffect(() => {
        dispatch(fetchConversations());
    }, [dispatch]);

    // Load messages when active partner changes
    useEffect(() => {
        if (activePartnerId) {
            dispatch(fetchMessages({ partnerId: activePartnerId, page: 1 }));
            dispatch(markConversationRead(activePartnerId));
            if (socketRef.current) {
                socketRef.current.emit("markRead", { partnerId: activePartnerId });
            }
        }
    }, [activePartnerId, dispatch]);

    // Auto-scroll to bottom on new messages
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

        // Stop typing
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

    // ─── Conversation List (inline JSX, not a component) ─────
    const conversationListJSX = (
        <Paper
            elevation={0}
            sx={{
                width: isMobile ? "100%" : 360,
                height: "100%",
                borderRadius: 4,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                bgcolor: "white",
            }}
        >
            {/* Header */}
            <Box sx={{ p: 3, pb: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: "#263238", mb: 2 }}>
                    Messages
                </Typography>
                <TextField
                    fullWidth
                    placeholder="Search conversations..."
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: "#90a4ae" }} />
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                            bgcolor: "#f1f5f9",
                            "& fieldset": { border: "none" },
                        },
                    }}
                />
            </Box>

            <Divider />

            {/* Conversation Items */}
            <List sx={{ flex: 1, overflow: "auto", px: 1 }}>
                {isLoadingConversations ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                        <CircularProgress size={32} sx={{ color: "#263238" }} />
                    </Box>
                ) : filteredConversations.length === 0 ? (
                    <Box sx={{ textAlign: "center", py: 6, px: 3 }}>
                        <ChatIcon sx={{ fontSize: 48, color: "#cfd8dc", mb: 2 }} />
                        <Typography variant="body1" color="text.secondary">
                            No conversations yet
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Book an appointment to start chatting with a doctor
                        </Typography>
                    </Box>
                ) : (
                    filteredConversations.map((conv) => (
                        <ListItem key={conv.partnerId} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                                onClick={() => handleSelectConversation(conv.partnerId)}
                                selected={conv.partnerId === activePartnerId}
                                sx={{
                                    borderRadius: 3,
                                    py: 1.5,
                                    px: 2,
                                    "&.Mui-selected": {
                                        bgcolor: "#e8eaf6",
                                        "&:hover": { bgcolor: "#e8eaf6" },
                                    },
                                    "&:hover": { bgcolor: "#f5f5f5" },
                                }}
                            >
                                <ListItemAvatar>
                                    <Badge
                                        badgeContent={conv.unreadCount || 0}
                                        color="error"
                                        invisible={!conv.unreadCount}
                                    >
                                        <Avatar
                                            sx={{
                                                bgcolor: conv.partnerRole === "doctor" ? "#263238" : "#1a237e",
                                                width: 48,
                                                height: 48,
                                                fontSize: 18,
                                                fontWeight: 700,
                                            }}
                                        >
                                            {conv.partnerName?.charAt(0)?.toUpperCase()}
                                        </Avatar>
                                    </Badge>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <Typography
                                                variant="subtitle2"
                                                sx={{
                                                    fontWeight: conv.unreadCount ? 800 : 600,
                                                    color: "#263238",
                                                    maxWidth: 160,
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                {conv.partnerName}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: "#90a4ae", flexShrink: 0, ml: 1 }}>
                                                {formatConvTime(conv.lastMessage?.createdAt)}
                                            </Typography>
                                        </Box>
                                    }
                                    secondary={
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: conv.unreadCount ? "#263238" : "#90a4ae",
                                                fontWeight: conv.unreadCount ? 600 : 400,
                                                maxWidth: 200,
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {conv.lastMessage?.text || "No messages yet"}
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

    // ─── Message Area (inline JSX, not a component) ──────
    const messageAreaJSX = (
        <Paper
            elevation={0}
            sx={{
                flex: 1,
                height: "100%",
                borderRadius: 4,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                bgcolor: "white",
                ml: isMobile ? 0 : 2,
            }}
        >
            {!activePartnerId ? (
                /* Empty state */
                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        px: 3,
                    }}
                >
                    <Box
                        sx={{
                            width: 100,
                            height: 100,
                            borderRadius: "50%",
                            bgcolor: "#f1f5f9",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mb: 3,
                        }}
                    >
                        <ChatIcon sx={{ fontSize: 48, color: "#263238" }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#263238", mb: 1 }}>
                        Start a Conversation
                    </Typography>
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                        Select a conversation from the list to start messaging
                    </Typography>
                </Box>
            ) : (
                <>
                    {/* Chat Header */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            px: 3,
                            py: 2,
                            borderBottom: "1px solid #f0f0f0",
                        }}
                    >
                        {isMobile && (
                            <IconButton
                                onClick={() => {
                                    setShowConversations(true);
                                    dispatch(setActivePartner(null));
                                }}
                                size="small"
                            >
                                <ArrowBackIcon />
                            </IconButton>
                        )}
                        <Avatar
                            sx={{
                                bgcolor: activeConversation?.partnerRole === "doctor" ? "#263238" : "#1a237e",
                                width: 44,
                                height: 44,
                                fontWeight: 700,
                            }}
                        >
                            {activeConversation?.partnerName?.charAt(0)?.toUpperCase()}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#263238" }}>
                                {activeConversation?.partnerName}
                            </Typography>
                            {typingUsers[activePartnerId] ? (
                                <Typography variant="caption" sx={{ color: "#43a047", fontWeight: 600 }}>
                                    typing...
                                </Typography>
                            ) : (
                                <Chip
                                    label={activeConversation?.partnerRole === "doctor" ? "Doctor" : "Patient"}
                                    size="small"
                                    sx={{
                                        height: 22,
                                        fontSize: 11,
                                        fontWeight: 600,
                                        bgcolor: activeConversation?.partnerRole === "doctor" ? "#e8eaf6" : "#e0f2f1",
                                        color: activeConversation?.partnerRole === "doctor" ? "#1a237e" : "#00695c",
                                    }}
                                />
                            )}
                        </Box>
                    </Box>

                    {/* Messages */}
                    <Box
                        ref={messagesContainerRef}
                        sx={{
                            flex: 1,
                            overflow: "auto",
                            px: 3,
                            py: 2,
                            bgcolor: "#f8f9fa",
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                        }}
                    >
                        {/* Load more */}
                        {currentPage < totalPages && (
                            <Box sx={{ textAlign: "center", mb: 1 }}>
                                <Chip
                                    label="Load older messages"
                                    onClick={handleLoadMore}
                                    clickable
                                    size="small"
                                    sx={{
                                        bgcolor: "white",
                                        fontWeight: 600,
                                        "&:hover": { bgcolor: "#e8eaf6" },
                                    }}
                                />
                            </Box>
                        )}

                        {isLoadingMessages && currentPage === 1 ? (
                            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                                <CircularProgress size={32} sx={{ color: "#263238" }} />
                            </Box>
                        ) : messages.length === 0 ? (
                            <Box sx={{ textAlign: "center", py: 6 }}>
                                <Typography variant="body2" color="text.secondary">
                                    No messages yet. Say hello! 👋
                                </Typography>
                            </Box>
                        ) : (
                            messages.map((msg) => {
                                const isMine =
                                    (msg.sender?._id || msg.sender) === user?._id;
                                return (
                                    <Box
                                        key={msg._id}
                                        sx={{
                                            display: "flex",
                                            justifyContent: isMine ? "flex-end" : "flex-start",
                                            mb: 0.5,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                maxWidth: "70%",
                                                px: 2.5,
                                                py: 1.5,
                                                borderRadius: isMine
                                                    ? "20px 20px 4px 20px"
                                                    : "20px 20px 20px 4px",
                                                bgcolor: isMine ? "#263238" : "white",
                                                color: isMine ? "white" : "#263238",
                                                boxShadow: isMine
                                                    ? "none"
                                                    : "0 1px 3px rgba(0,0,0,0.06)",
                                            }}
                                        >
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    whiteSpace: "pre-wrap",
                                                    wordBreak: "break-word",
                                                    lineHeight: 1.5,
                                                }}
                                            >
                                                {msg.text}
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    display: "block",
                                                    textAlign: "right",
                                                    mt: 0.5,
                                                    opacity: 0.7,
                                                    fontSize: 10,
                                                }}
                                            >
                                                {formatMessageTime(msg.createdAt)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                );
                            })
                        )}
                        <div ref={messagesEndRef} />
                    </Box>

                    {/* Input */}
                    <Box
                        sx={{
                            p: 2,
                            borderTop: "1px solid #f0f0f0",
                            display: "flex",
                            alignItems: "flex-end",
                            gap: 1.5,
                        }}
                    >
                        <TextField
                            fullWidth
                            multiline
                            maxRows={4}
                            placeholder="Type a message..."
                            value={messageText}
                            onChange={handleTyping}
                            onKeyDown={handleKeyDown}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 4,
                                    bgcolor: "#f1f5f9",
                                    "& fieldset": { border: "none" },
                                    "&:focus-within": {
                                        bgcolor: "#f1f5f9",
                                        boxShadow: "0 0 0 2px #263238",
                                    },
                                },
                            }}
                        />
                        <IconButton
                            onClick={handleSendMessage}
                            disabled={!messageText.trim()}
                            sx={{
                                bgcolor: "#263238",
                                color: "white",
                                width: 48,
                                height: 48,
                                borderRadius: 3,
                                "&:hover": { bgcolor: "#37474f" },
                                "&.Mui-disabled": {
                                    bgcolor: "#cfd8dc",
                                    color: "white",
                                },
                            }}
                        >
                            <SendIcon />
                        </IconButton>
                    </Box>
                </>
            )}
        </Paper>
    );

    return (
        <Box
            sx={{
                height: "calc(100vh - 40px)",
                display: "flex",
                p: isMobile ? 1 : 3,
                pt: isMobile ? 1 : 2,
            }}
        >
            {/* Mobile: toggle between list and chat */}
            {isMobile ? (
                showConversations ? conversationListJSX : messageAreaJSX
            ) : (
                <>
                    {conversationListJSX}
                    {messageAreaJSX}
                </>
            )}
        </Box>
    );
};

export default ChatPage;
