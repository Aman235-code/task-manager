import { z } from "zod";

export const CreateTaskDto = z.object({
  title: z.string().max(100),
  description: z.string(),
  dueDate: z.string(), // ISO string
  priority: z.enum(["Low","Medium","High","Urgent"]).optional(),
  status: z.enum(["To Do","In Progress","Review","Completed"]).optional(),
  assignedToId: z.string()
});

export const UpdateTaskDto = z.object({
  title: z.string().max(100).optional(),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  priority: z.enum(["Low","Medium","High","Urgent"]).optional(),
  status: z.enum(["To Do","In Progress","Review","Completed"]).optional(),
  assignedToId: z.string().optional()
});

export type CreateTaskInput = z.infer<typeof CreateTaskDto>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskDto>;
