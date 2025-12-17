import { Request, Response } from "express";
import { Notification } from "./notification.model";
import { Types } from "mongoose";

/**
 * Retrieves the latest notifications for the authenticated user.
 *
 * @param req - Express request object, expects `req.user.id` to be set
 * @param res - Express response object
 *
 * @returns JSON array of notifications, sorted by newest first
 * @throws 500 Internal Server Error if database query fails
 */
export async function getMyNotifications(req: Request, res: Response) {
  try {
    const userId = req.user!.id;

    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(notifications);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

/**
 * Marks a single notification as read for the authenticated user.
 *
 * @param req - Express request object, expects `req.user.id` and `req.params.id`
 * @param res - Express response object
 *
 * @returns The updated notification object
 * @throws 400 if `notificationId` is invalid
 * @throws 404 if notification is not found
 * @throws 500 Internal Server Error if database operation fails
 */
export async function markNotificationAsRead(
  req: Request,
  res: Response
) {
  try {
    const userId = req.user!.id;
    const notificationId = req.params.id;

    if (!Types.ObjectId.isValid(notificationId)) {
      return res.status(400).json({ message: "Invalid notification id" });
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json(notification);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

/**
 * Marks all unread notifications as read for the authenticated user.
 *
 * @param req - Express request object, expects `req.user.id`
 * @param res - Express response object
 *
 * @returns Confirmation message
 * @throws 500 Internal Server Error if database operation fails
 */
export async function markAllAsRead(req: Request, res: Response) {
  try {
    const userId = req.user!.id;

    await Notification.updateMany(
      { userId, read: false },
      { read: true }
    );

    res.json({ message: "All notifications marked as read" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

/**
 * Deletes a notification by ID.
 *
 * @param req - Express request object, expects `req.params.id`
 * @param res - Express response object
 *
 * @returns Confirmation message on successful deletion
 * @throws 500 Internal Server Error if database operation fails
 */
export async function deleteNotification(req: Request, res: Response) {
  try {
    const { id } = req.params;

    await Notification.findByIdAndDelete({ _id: id });

    res.json({ message: "Notification is Deleted" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}
