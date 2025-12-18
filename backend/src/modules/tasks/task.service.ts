import { taskRepository } from "./task.repository";
import { CreateTaskDto, UpdateTaskDto } from "./task.dto";
import { ITask, TaskPriority, TaskStatus } from "./task.model";
import { Types } from "mongoose";
import { z } from "zod";
import { Notification } from "../notifications/notification.model";
import { HttpError } from "../../utils/httpError";

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

/**
 * Service layer for task-related operations.
 *
 * Handles business logic including creation, updates,
 * deletion, and user-specific task queries.
 */
export class TaskService {
  /**
   * Creates a new task.
   *
   * Optionally emits socket events and creates notifications
   * for the assigned user.
   *
   * @param userId - ID of the user creating the task
   * @param data - Task creation input
   * @param io - Optional Socket.IO instance for real-time events
   * @returns The created task document
   * @throws HttpError 500 if creation fails
   */
  async createTask(
    userId: string,
    data: CreateTaskInput,
    io?: any
  ): Promise<ITask> {
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
      const creatorRoom = userId;
      const assigneeRoom = data.assignedToId;

      console.log("📤 Emitting taskCreated");
      console.log("   taskId:", task._id.toString());
      console.log("   creatorRoom:", creatorRoom);
      console.log("   assigneeRoom:", assigneeRoom);

      io.to(creatorRoom).emit("taskCreated", task);
      if (assigneeRoom !== creatorRoom) {
        io.to(assigneeRoom).emit("taskCreated", task);
      }

      const notification = await Notification.create({
        userId: data.assignedToId,
        taskId: task._id,
        message: `You were assigned a new task: ${task.title}`,
      });

      console.log("📤 Emitting notification");
      console.log("   to:", assigneeRoom);
      console.log("   notificationId:", notification._id.toString());

      io.to(assigneeRoom).emit("notification", notification);
    }

    return task;
  }

  /**
   * Retrieves a task by ID.
   *
   * @param taskId - Task ID
   * @returns The task document
   * @throws HttpError 404 if task is not found
   */
  async getTaskById(taskId: string): Promise<ITask> {
    const task = await taskRepository.findById(taskId);
    if (!task) {
      throw new HttpError(404, "Task not found");
    }
    return task;
  }

  /**
   * Updates a task by ID.
   *
   * Checks that the user is either the creator or assignee.
   * Optionally emits socket events and creates notifications for new assignees.
   *
   * @param taskId - Task ID
   * @param userId - User performing the update
   * @param data - Task update input
   * @param io - Optional Socket.IO instance for real-time events
   * @returns The updated task document
   * @throws HttpError 403 if user is not authorized
   * @throws HttpError 404 if task is not found
   * @throws HttpError 500 if update fails
   */
  async updateTask(
    taskId: string,
    userId: string,
    data: UpdateTaskInput,
    io?: any
  ): Promise<ITask> {
    const task = await taskRepository.findById(taskId);
    if (!task) {
      throw new HttpError(404, "Task not found");
    }

    if (
      task.creatorId.toString() !== userId &&
      task.assignedToId.toString() !== userId
    ) {
      throw new HttpError(403, "Unauthorized to update this task");
    }

    const previousAssignee = task.assignedToId?.toString();

    const updateData: Partial<TaskInput> = {
      title: data.title,
      description: data.description,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      priority: data.priority as TaskPriority | undefined,
      status: data.status as TaskStatus | undefined,
      assignedToId: data.assignedToId
        ? new Types.ObjectId(data.assignedToId)
        : undefined,
    };

    const updatedTask = await taskRepository.update(taskId, updateData);
    if (!updatedTask) {
      throw new HttpError(500, "Failed to update task");
    }

    const newAssignee = updatedTask.assignedToId?.toString();

    if (io) {
      const creatorRoom = task.creatorId.toString();
      const assigneeRoom = newAssignee;

      console.log("📤 Emitting taskUpdated");
      console.log("   taskId:", updatedTask._id.toString());
      console.log("   creatorRoom:", creatorRoom);
      console.log("   assigneeRoom:", assigneeRoom);

      io.to(creatorRoom).emit("taskUpdated", updatedTask);
      if (assigneeRoom && assigneeRoom !== creatorRoom) {
        io.to(assigneeRoom).emit("taskUpdated", updatedTask);
      }

      if (assigneeRoom && assigneeRoom !== previousAssignee) {
        const notification = await Notification.create({
          userId: assigneeRoom,
          taskId: updatedTask._id,
          message: `You were assigned a task: ${updatedTask.title}`,
        });

        console.log("📤 Emitting reassignment notification");
        console.log("   to:", assigneeRoom);

        io.to(assigneeRoom).emit("notification", notification);
      }
    }

    return updatedTask;
  }

  /**
   * Deletes a task by ID.
   *
   * Only the creator can delete a task.
   * Optionally emits socket events and notifies the assignee.
   *
   * @param taskId - Task ID
   * @param userId - User performing the deletion
   * @param io - Optional Socket.IO instance for real-time events
   * @returns The deleted task document
   * @throws HttpError 403 if user is not the creator
   * @throws HttpError 404 if task is not found
   * @throws HttpError 500 if deletion fails
   */
  async deleteTask(taskId: string, userId: string, io?: any): Promise<ITask> {
    const task = await taskRepository.findById(taskId);
    if (!task) throw new HttpError(404, "Task not found");
    if (task.creatorId.toString() !== userId)
      throw new HttpError(403, "Only the creator can delete this task");

    const deletedTask = await taskRepository.delete(taskId);
    if (!deletedTask) throw new HttpError(500, "Failed to delete task");

    if (io) {
      const creatorRoom = task.creatorId.toString();
      const assigneeRoom = task.assignedToId.toString();

      console.log("📤 Emitting taskDeleted");
      console.log("   taskId:", deletedTask._id.toString());
      console.log("   creatorRoom:", creatorRoom);
      console.log("   assigneeRoom:", assigneeRoom);

      io.to(creatorRoom).emit("taskDeleted", deletedTask);
      if (assigneeRoom !== creatorRoom) {
        io.to(assigneeRoom).emit("taskDeleted", deletedTask);
      }

      const notification = await Notification.create({
        userId: task.assignedToId,
        taskId: task._id,
        message: `Task deleted: ${task.title}`,
      });

      console.log("📤 Emitting delete notification");
      console.log("   to:", assigneeRoom);

      io.to(assigneeRoom).emit("notification", notification);
    }

    return deletedTask;
  }

  /**
   * Retrieves all tasks and overdue tasks for a user.
   *
   * @param userId - User ID
   * @returns Object containing `tasks` and `overdueTasks` arrays
   */
  async getTasksForUser(userId: string) {
    const tasks = await taskRepository.findByUser(userId);
    const overdueTasks = await taskRepository.findOverdue(userId);
    return { tasks, overdueTasks };
  }
}

/**
 * Singleton instance of TaskService for use in controllers.
 */
export const taskService = new TaskService();
