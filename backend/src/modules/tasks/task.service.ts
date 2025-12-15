import { taskRepository } from "./task.repository";
import { CreateTaskDto, UpdateTaskDto } from "./task.dto";
import { ITask } from "./task.model";
import { Types } from "mongoose";

export class TaskService {
  async createTask(userId: string, data: CreateTaskDto): Promise<ITask> {
    const taskData = {
      ...data,
      creatorId: new Types.ObjectId(userId),
      assignedToId: new Types.ObjectId(data.assignedToId),
      dueDate: new Date(data.dueDate)
    };

    const task = await taskRepository.create(taskData);
    return task;
  }

  async getTaskById(taskId: string): Promise<ITask | null> {
    return taskRepository.findById(taskId);
  }

  async getAllTasks(): Promise<ITask[]> {
    return taskRepository.findAll();
  }

  async updateTask(
    taskId: string,
    userId: string,
    data: UpdateTaskDto
  ): Promise<ITask | null> {
    const task = await taskRepository.findById(taskId);
    if (!task) throw new Error("Task not found");

    // Only creator or assignee can update
    if (
      task.creatorId.toString() !== userId &&
      task.assignedToId.toString() !== userId
    ) {
      throw new Error("Unauthorized to update this task");
    }

    const updateData: Partial<ITask> = {
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      assignedToId: data.assignedToId
        ? new Types.ObjectId(data.assignedToId)
        : undefined
    };

    const updatedTask = await taskRepository.update(taskId, updateData);
    return updatedTask;
  }

  async deleteTask(taskId: string, userId: string): Promise<ITask | null> {
    const task = await taskRepository.findById(taskId);
    if (!task) throw new Error("Task not found");

    if (task.creatorId.toString() !== userId) {
      throw new Error("Only creator can delete task");
    }

    return taskRepository.delete(taskId);
  }

  async getTasksForUser(userId: string) {
    const tasks = await taskRepository.findByUser(userId);
    const overdueTasks = await taskRepository.findOverdue(userId);

    return { tasks, overdueTasks };
  }
}

export const taskService = new TaskService();
