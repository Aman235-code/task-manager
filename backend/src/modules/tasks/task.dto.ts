import { z } from "zod";

/**
 * Data Transfer Object for creating a new task.
 *
 * Validates incoming request body for the `createTask` endpoint.
 *
 * @property title - Task title (max 100 characters)
 * @property description - Task description
 * @property dueDate - Due date as an ISO string
 * @property priority - Task priority, optional, one of "Low", "Medium", "High", "Urgent"
 * @property status - Task status, optional, one of "To Do", "In Progress", "Review", "Completed"
 * @property assignedToId - User ID of the assignee
 */
export const CreateTaskDto = z.object({
  title: z.string().max(100),
  description: z.string(),
  dueDate: z.string(), // ISO string
  priority: z.enum(["Low", "Medium", "High", "Urgent"]).optional(),
  status: z.enum(["To Do", "In Progress", "Review", "Completed"]).optional(),
  assignedToId: z.string(),
});

/**
 * Data Transfer Object for updating an existing task.
 *
 * All fields are optional. Validates incoming request body
 * for the `updateTask` endpoint.
 *
 * @property title - Updated task title (max 100 characters)
 * @property description - Updated task description
 * @property dueDate - Updated due date as an ISO string
 * @property priority - Updated task priority
 * @property status - Updated task status
 * @property assignedToId - Updated assignee user ID
 */
export const UpdateTaskDto = z.object({
  title: z.string().max(100).optional(),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  priority: z.enum(["Low", "Medium", "High", "Urgent"]).optional(),
  status: z.enum(["To Do", "In Progress", "Review", "Completed"]).optional(),
  assignedToId: z.string().optional(),
});

/**
 * TypeScript type inferred from CreateTaskDto.
 */
export type CreateTaskInput = z.infer<typeof CreateTaskDto>;

/**
 * TypeScript type inferred from UpdateTaskDto.
 */
export type UpdateTaskInput = z.infer<typeof UpdateTaskDto>;
