// models/Notification.ts
import { Schema, model } from "mongoose";

/**
 * Mongoose schema for a user notification.
 *
 * Represents notifications related to tasks or system events.
 *
 * @property userId - Reference to the user who receives the notification
 * @property message - Notification message content
 * @property taskId - Optional reference to a related task
 * @property read - Whether the notification has been read
 * @property createdAt - Auto-managed creation timestamp
 * @property updatedAt - Auto-managed update timestamp
 */
const notificationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    taskId: { type: Schema.Types.ObjectId, ref: "Task" },
    read: { type: Boolean, default: false },
  },
  { timestamps: true } // Adds `createdAt` and `updatedAt`
);

/**
 * Mongoose model for notifications.
 *
 * Provides standard CRUD operations and query helpers for notifications.
 */
export const Notification = model("Notification", notificationSchema);
