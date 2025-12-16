import { taskRepository } from "./task.repository";
import { CreateTaskDto, UpdateTaskDto } from "./task.dto";
import { ITask, TaskPriority, TaskStatus } from "./task.model";
import { Types } from "mongoose";
import { z } from "zod";
import { Notification } from "../notifications/notification.model";

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
      assignedToId: new Types.ObjectId(data.assignedToId),
    };

    const task = await taskRepository.create(taskData);

    if (io) {
      // Notify only the creator and assignee
      io.to(userId).emit("taskCreated", task);
      io.to(data.assignedToId).emit("taskCreated", task);

      const notification = await Notification.create({
        userId: data.assignedToId,
        taskId: task._id,
        message: `You were assigned a new task: ${task.title}`,
      });

      io.to(data.assignedToId).emit("notification", notification);
    }

    return task;
  }

  async getTaskById(taskId: string): Promise<ITask | null> {
    return taskRepository.findById(taskId);
  }

  async updateTask(taskId: string, userId: string, data: UpdateTaskInput, io?: any): Promise<ITask | null> {
    const task = await taskRepository.findById(taskId);
    if (!task) throw new Error("Task not found");

    if (task.creatorId.toString() !== userId && task.assignedToId.toString() !== userId) {
      const err: any = new Error("Unauthorized to update this task");
      err.status = 401;
      throw err;
    }

    const previousAssignee = task.assignedToId?.toString();

    const updateData: Partial<TaskInput> = {
      title: data.title,
      description: data.description,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      priority: data.priority as TaskPriority | undefined,
      status: data.status as TaskStatus | undefined,
      assignedToId: data.assignedToId ? new Types.ObjectId(data.assignedToId) : undefined,
    };

    const updatedTask = await taskRepository.update(taskId, updateData);
    if (!updatedTask) return null;

    const newAssignee = updatedTask.assignedToId?.toString();

    if (io) {
      // Notify creator and new assignee
      io.to(task.creatorId.toString()).emit("taskUpdated", updatedTask);
      io.to(newAssignee!).emit("taskUpdated", updatedTask);

      // Send notification if assignee changed
      if (newAssignee && newAssignee !== previousAssignee) {
        const notification = await Notification.create({
          userId: newAssignee,
          taskId: updatedTask._id,
          message: `You were assigned a task: ${updatedTask.title}`,
        });

        io.to(newAssignee).emit("notification", notification);
      }
    }

    return updatedTask;
  }

  async deleteTask(taskId: string, userId: string, io?: any): Promise<ITask | null> {
    const task = await taskRepository.findById(taskId);
    if (!task) {
      const err: any = new Error("Task not found");
      err.status = 404;
      throw err;
    }

    if (task.creatorId.toString() !== userId) {
      const err: any = new Error("Only creator can delete task");
      err.status = 401;
      throw err;
    }

    const deletedTask = await taskRepository.delete(taskId);

    if (io) {
      io.to(task.creatorId.toString()).emit("taskDeleted", deletedTask);
      io.to(task.assignedToId.toString()).emit("taskDeleted", deletedTask);

      const notification = await Notification.create({
        userId: task.assignedToId,
        taskId: task._id,
        message: `Task deleted: ${task.title}`,
      });

      io.to(task.assignedToId.toString()).emit("notification", notification);
    }

    return deletedTask;
  }

  async getTasksForUser(userId: string) {
    const tasks = await taskRepository.findByUser(userId);
    const overdueTasks = await taskRepository.findOverdue(userId);
    return { tasks, overdueTasks };
  }
}

export const taskService = new TaskService();
