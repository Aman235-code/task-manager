import { Schema, model, Types, Document } from "mongoose";

/**
 * Enum representing possible task priorities.
 */
export enum TaskPriority {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
  URGENT = "Urgent",
}

/**
 * Enum representing possible task statuses.
 */
export enum TaskStatus {
  TODO = "To Do",
  IN_PROGRESS = "In Progress",
  REVIEW = "Review",
  COMPLETED = "Completed",
}

/**
 * Interface representing a Task document in MongoDB.
 */
export interface ITask extends Document {
  title: string;
  description: string;
  dueDate: Date;
  priority: TaskPriority;
  status: TaskStatus;
  creatorId: Types.ObjectId;
  assignedToId: Types.ObjectId;
}

/**
 * Mongoose schema for Task.
 *
 * Fields:
 * - title: Task title, required, max length 100
 * - description: Task description, required
 * - dueDate: Task due date, required
 * - priority: Task priority, required, must be one of TaskPriority
 * - status: Task status, required, must be one of TaskStatus
 * - creatorId: Reference to the user who created the task
 * - assignedToId: Reference to the user assigned to the task
 *
 * Includes timestamps: `createdAt` and `updatedAt`
 */
const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
      maxlength: 100,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    priority: {
      type: String,
      enum: Object.values(TaskPriority),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      required: true,
    },
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedToId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

/**
 * Mongoose model for tasks.
 *
 * Provides standard CRUD operations and query helpers.
 */
export const Task = model<ITask>("Task", taskSchema);
