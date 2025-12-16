// models/Notification.ts
import { Schema, model } from "mongoose";

const notificationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
  taskId: { type: Schema.Types.ObjectId, ref: "Task" },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
},{ timestamps: true });

export const Notification = model("Notification", notificationSchema);
