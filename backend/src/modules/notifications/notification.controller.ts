import { Request, Response } from "express";
import { Notification } from "./Notification";
import { Types } from "mongoose";

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
