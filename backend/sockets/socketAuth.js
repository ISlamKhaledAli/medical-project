import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

/**
 * Socket.IO authentication middleware.
 * Runs during the handshake phase — before the "connection" event fires.
 *
 * The client must send the JWT access token either:
 *   - As a query param:  io("http://...", { query: { token: "..." } })
 *   - Or as an auth object: io("http://...", { auth: { token: "..." } })
 *
 * On success: attaches `socket.userId` and allows the connection.
 * On failure: rejects the handshake with an error the client can handle.
 */
export const authenticateSocket = async (socket, next) => {
    try {
        const token =
            socket.handshake.auth?.token || socket.handshake.query?.token;

        if (!token) {
            return next(new Error("Authentication required. No token provided."));
        }

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        const user = await User.findById(decoded.id).select(
            "_id role isBlocked",
        );

        if (!user) {
            return next(new Error("User not found. Connection rejected."));
        }

        if (user.isBlocked) {
            return next(
                new Error("Account blocked. Connection rejected."),
            );
        }

        // Attach userId to socket for room management
        socket.userId = user._id.toString();
        socket.userRole = user.role;

        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return next(new Error("Token expired. Please re-authenticate."));
        }
        return next(new Error("Invalid token. Connection rejected."));
    }
};
