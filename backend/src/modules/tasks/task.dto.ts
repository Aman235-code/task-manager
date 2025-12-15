import { z } from "zod";
import { TaskPriority, TaskStatus } from "./task.model";

export const CreateTaskDto = z.object({
  title: z.string().max(100),
  description: z.string(),
  dueDate: z.string(), // ISO date string
  priority: z.enum([TaskPriority.LOW, TaskPriority.MEDIUM, TaskPriority.HIGH, TaskPriority.URGENT]),
  status: z.enum([TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.REVIEW, TaskStatus.COMPLETED]),
  assignedToId: z.string()
});

export const UpdateTaskDto = z.object({
  title: z.string().max(100).optional(),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  priority: z.enum([TaskPriority.LOW, TaskPriority.MEDIUM, TaskPriority.HIGH, TaskPriority.URGENT]).optional(),
  status: z.enum([TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.REVIEW, TaskStatus.COMPLETED]).optional(),
  assignedToId: z.string().optional()
});
