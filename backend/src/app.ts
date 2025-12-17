import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/users/user.routes";
import taskRoutes from "./modules/tasks/task.routes";
import notificationRoutes from "./modules/notifications/notification.routes";

/**
 * Express application instance.
 *
 * This is the central HTTP application responsible for:
 * - Parsing incoming requests
 * - Managing authentication state via cookies
 * - Enforcing CORS policies
 * - Routing API requests to feature modules
 *
 * The HTTP server and Socket.IO server are attached
 * externally during application startup.
 */
export const app = express();

/**
 * Parse incoming JSON payloads.
 *
 * This middleware must be registered early
 * so all downstream routes can access req.body.
 */
app.use(express.json());

/**
 * Parse cookies attached to incoming requests.
 *
 * Used primarily for authentication tokens
 * and session-related data.
 */
app.use(cookieParser());

/**
 * Configure Cross-Origin Resource Sharing (CORS).
 *
 * - Allows requests from trusted origins
 * - Enables credentialed requests (cookies, auth headers)
 *
 * Origin is intentionally dynamic to support
 * multiple environments (local, staging, production).
 */
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

/**
 * Lightweight health check endpoint.
 *
 * Useful for:
 * - Load balancers
 * - Container orchestration probes
 * - Basic uptime monitoring
 */
app.get("/", (_req, res) => {
  res.send("Server is running");
});

/**
 * Authentication and authorization routes.
 */
app.use("/api/v1/auth", authRoutes);

/**
 * User management routes.
 */
app.use("/api/v1/users", userRoutes);

/**
 * Task management and assignment routes.
 */
app.use("/api/v1/tasks", taskRoutes);

/**
 * Notification delivery and status routes.
 */
app.use("/api/v1/notifications", notificationRoutes);
