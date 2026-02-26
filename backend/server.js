import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { createServer } from "http";
import cors from "cors";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import availabilityRoutes from "./routes/availability.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import doctorRoutes from "./routes/doctor.routes.js";
import specialtyRoutes from "./routes/specialty.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import { globalErrorHandler } from "./middleware/error.middleware.js";
import { initSocket } from "./sockets/socket.js";
import cookieParser from "cookie-parser";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const httpServer = createServer(app);

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
    ],
  }),
);

app.use(express.json());

// Serve static test pages
app.use(express.static(join(__dirname, "public")));

app.use(cookieParser());

await connectDB();

// Initialize Socket.IO on the HTTP server
initSocket(httpServer);

app.get("/api/health", (req, res) =>
  res.json({ status: "ok", timestamp: new Date() }),
);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/specialties", specialtyRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chat", chatRoutes);

app.use(globalErrorHandler);

httpServer.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
  console.log("🚀 Server fully initialized and listening");
});
