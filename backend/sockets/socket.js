import { Server } from "socket.io";
import { authenticateSocket } from "./socketAuth.js";

/**
 * Singleton Socket.IO instance.
 *
 * Why a module-level variable instead of passing `io` through function params?
 * — Avoids threading io through every service call signature.
 * — Services call getIO() only when emitting; if io is not initialized (e.g., in
 *   unit tests), the safe getter returns null and emitting is skipped.
 * — No circular dependency: this module imports nothing from services or controllers.
 *
 * Dependency direction:
 *   server.js  →  sockets/socket.js  →  sockets/socketAuth.js
 *   services/* →  sockets/socket.js  (getIO only, one-way leaf dependency)
 */

let io = null;

/**
 * Initialize Socket.IO on an existing HTTP server.
 * Called once from server.js after creating the HTTP server.
 *
 * @param {import("http").Server} httpServer
 * @returns {Server} the Socket.IO server instance
 */
export const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL || "http://localhost:5173",
            methods: ["GET", "POST"],
            credentials: true,
        },
        pingTimeout: 60000,
        pingInterval: 25000,
    });

    // Authenticate every incoming socket connection via JWT
    io.use(authenticateSocket);

    io.on("connection", (socket) => {
        const userId = socket.userId;

        // Each user joins a private room named after their userId.
        // This allows io.to(userId).emit() from anywhere in the service layer.
        socket.join(userId);

        console.log(`🔌 Socket connected: userId=${userId}  socketId=${socket.id}`);

        socket.on("disconnect", (reason) => {
            console.log(`❌ Socket disconnected: userId=${userId}  reason=${reason}`);
        });
    });

    return io;
};

/**
 * Safe getter for the Socket.IO instance.
 * Returns null if Socket.IO has not been initialized yet (e.g., during tests).
 * Services should guard: `const io = getIO(); if (io) { ... }`
 *
 * @returns {Server|null}
 */
export const getIO = () => io;

/**
 * Disconnect all sockets belonging to a specific user.
 * Used when blocking a user or forcing logout.
 *
 * @param {string} userId
 */
export const disconnectUser = (userId) => {
    if (!io) return;

    const room = io.sockets.adapter.rooms.get(userId);
    if (room) {
        for (const socketId of room) {
            const socket = io.sockets.sockets.get(socketId);
            if (socket) {
                socket.emit("forceDisconnect", {
                    message: "Your session has been terminated.",
                });
                socket.disconnect(true);
            }
        }
    }
};
