import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { addNotification } from '../features/notification/notificationSlice';

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL.replace('/api', '');

const useSocket = () => {
    const dispatch = useDispatch();
    const { token, user } = useSelector((state) => state.auth);
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
        });

        socketRef.current.on('newNotification', (data) => {
            console.log('🔔 New Notification received:', data);
            dispatch(addNotification(data));
        });

        socketRef.current.on('forceDisconnect', (data) => {
            console.warn('⚠️ Server forced disconnect:', data.message);
            // Handle global logout if necessary
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
