import { taskRepository } from "./task.repository";
import { CreateTaskDto, UpdateTaskDto } from "./task.dto";
import { ITask, TaskPriority, TaskStatus } from "./task.model";
import { Types } from "mongoose";
import { z } from "zod";

type CreateTaskInput = z.infer<typeof CreateTaskDto>;
type UpdateTaskInput = z.infer<typeof UpdateTaskDto>;

type TaskInput = {
  title: string;
  description: string;
  dueDate: Date;
  priority: TaskPriority;
  status: TaskStatus;
  creatorId: Types.ObjectId;
  assignedToId: Types.ObjectId;
};


export class TaskService {
  async createTask(userId: string, data: CreateTaskInput, io?: any): Promise<ITask> {
   const taskData: TaskInput = {
  title: data.title,
  description: data.description,
  dueDate: new Date(data.dueDate),
  priority: (data.priority || TaskPriority.LOW) as TaskPriority,
  status: (data.status || TaskStatus.TODO) as TaskStatus,
  creatorId: new Types.ObjectId(userId),
  assignedToId: new Types.ObjectId(data.assignedToId)
};



    const task = await taskRepository.create(taskData);

    if (io) {
      io.emit("taskCreated", task);
      io.to(data.assignedToId).emit("taskAssigned", task);
    }

    return task;
  }

  async getTaskById(taskId: string): Promise<ITask | null> {
    return taskRepository.findById(taskId);
  }

  async getAllTasks(): Promise<ITask[]> {
    return taskRepository.findAll();
  }

  async updateTask(taskId: string, userId: string, data: UpdateTaskInput, io?: any): Promise<ITask | null> {
    const task = await taskRepository.findById(taskId);
    if (!task) throw new Error("Task not found");

    if (task.creatorId.toString() !== userId && task.assignedToId.toString() !== userId) {
      throw new Error("Unauthorized to update this task");
    }

   const updateData: Partial<TaskInput> = {
  title: data.title,
  description: data.description,
  dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
  priority: data.priority ? (data.priority as TaskPriority) : undefined,
  status: data.status ? (data.status as TaskStatus) : undefined,
  assignedToId: data.assignedToId ? new Types.ObjectId(data.assignedToId) : undefined
};


    const updatedTask = await taskRepository.update(taskId, updateData);

    if (io && updatedTask) {
      io.emit("taskUpdated", updatedTask);
      if (data.assignedToId) {
        io.to(data.assignedToId).emit("taskAssigned", updatedTask);
      }
    }

    return updatedTask;
  }

  async deleteTask(taskId: string, userId: string): Promise<ITask | null> {
    const task = await taskRepository.findById(taskId);
    if (!task) throw new Error("Task not found");
    if (task.creatorId.toString() !== userId) throw new Error("Only creator can delete task");

    return taskRepository.delete(taskId);
  }

  async getTasksForUser(userId: string) {
    const tasks = await taskRepository.findByUser(userId);
    const overdueTasks = await taskRepository.findOverdue(userId);

    return { tasks, overdueTasks };
  }
}

export const taskService = new TaskService();
