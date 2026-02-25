import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { addNotification } from '../features/notification/notificationSlice';
import { addIncomingMessage, setTyping, clearTyping, fetchConversations } from '../features/chat/chatSlice';

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL.replace('/api', '');

const useSocket = () => {
    const dispatch = useDispatch();
    const { accessToken: token, user } = useSelector((state) => state.auth);
    const socketRef = useRef(null);

    useEffect(() => {
        if (!token || !user) {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
            return;
        }

        // Initialize socket with authentication
        socketRef.current = io(SOCKET_URL, {
            auth: { token },
            withCredentials: true,
            transports: ['websocket']
        });

        socketRef.current.on('connect', () => {
            console.log('🔌 Socket connected:', socketRef.current.id);
            // Load chat conversations once connected
            dispatch(fetchConversations());
        });

        socketRef.current.on('newNotification', (data) => {
            console.log('🔔 New Notification received:', data);
            dispatch(addNotification(data));
        });

        // ─── Chat Events ───────────────────────────────────
        socketRef.current.on('newMessage', (message) => {
            console.log('💬 New message received:', message);
            dispatch(addIncomingMessage(message));
        });

        socketRef.current.on('userTyping', ({ senderId }) => {
            dispatch(setTyping(senderId));
        });

        socketRef.current.on('userStopTyping', ({ senderId }) => {
            dispatch(clearTyping(senderId));
        });

        socketRef.current.on('chatError', (data) => {
            console.error('❌ Chat error:', data.message);
        });
        // ────────────────────────────────────────────────────

        socketRef.current.on('forceDisconnect', (data) => {
            console.warn('⚠️ Server forced disconnect:', data.message);
        });

        socketRef.current.on('disconnect', (reason) => {
            console.log('❌ Socket disconnected:', reason);
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [token, user, dispatch]);

    return socketRef.current;
};

export default useSocket;
