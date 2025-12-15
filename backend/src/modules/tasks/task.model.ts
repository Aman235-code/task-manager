import { Schema, model, Types, Document } from "mongoose";

export enum TaskPriority {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
  URGENT = "Urgent"
}

export enum TaskStatus {
  TODO = "To Do",
  IN_PROGRESS = "In Progress",
  REVIEW = "Review",
  COMPLETED = "Completed"
}

export interface ITask extends Document {
  title: string;
  description: string;
  dueDate: Date;
  priority: TaskPriority;
  status: TaskStatus;
  creatorId: Types.ObjectId;
  assignedToId: Types.ObjectId;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
      maxlength: 100,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    dueDate: {
      type: Date,
      required: true
    },
    priority: {
      type: String,
      enum: Object.values(TaskPriority),
      required: true
    },
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      required: true
    },
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    assignedToId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

export const Task = model<ITask>("Task", taskSchema);
