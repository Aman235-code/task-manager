import { Router } from "express";
import {
  getMyNotifications,
  markNotificationAsRead,
  markAllAsRead,
  deleteNotification,
} from "./notification.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

/**
 * Express router for user notifications.
 *
 * All routes require authentication via `authMiddleware`.
 */
const router = Router();

// Apply authentication middleware to all notification routes
router.use(authMiddleware);

/**
 * GET /api/v1/notifications
 * Fetch the latest notifications for the authenticated user.
 */
router.get("/", getMyNotifications);

/**
 * PATCH /api/v1/notifications/:id/read
 * Mark a single notification as read by ID.
 */
router.patch("/:id/read", markNotificationAsRead);

/**
 * PATCH /api/v1/notifications/read-all
 * Mark all unread notifications for the authenticated user as read.
 */
router.patch("/read-all", markAllAsRead);

/**
 * DELETE /api/v1/notifications/delete/:id
 * Delete a notification by ID.
 */
router.delete("/delete/:id", deleteNotification);

export default router;
