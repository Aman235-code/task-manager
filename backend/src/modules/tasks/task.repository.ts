import { Task, ITask } from "./task.model";
import { Types } from "mongoose";

/**
 * Repository class for Task model.
 *
 * Encapsulates database operations for tasks,
 * providing a single interface for CRUD and queries.
 */
export class TaskRepository {
  /**
   * Creates a new task in the database.
   *
   * @param taskData - Partial task object to create
   * @returns The created task document
   */
  async create(taskData: Partial<ITask>): Promise<ITask> {
    const task = await Task.create(taskData);
    return task;
  }

  /**
   * Finds a task by its ID.
   *
   * @param id - Task ID
   * @returns The task document if found, otherwise null
   */
  async findById(id: string): Promise<ITask | null> {
    return Task.findById(id);
  }

  /**
   * Retrieves all tasks in the database.
   *
   * @returns Array of all task documents
   */
  async findAll(): Promise<ITask[]> {
    return Task.find();
  }

  /**
   * Updates a task by ID.
   *
   * @param id - Task ID
   * @param data - Partial task data to update
   * @returns The updated task document if found, otherwise null
   */
  async update(id: string, data: Partial<ITask>): Promise<ITask | null> {
    return Task.findByIdAndUpdate(id, data, { new: true });
  }

  /**
   * Deletes a task by ID.
   *
   * @param id - Task ID
   * @returns The deleted task document if found, otherwise null
   */
  async delete(id: string): Promise<ITask | null> {
    return Task.findByIdAndDelete(id);
  }

  /**
   * Finds tasks where the user is either the creator or assignee.
   *
   * @param userId - User ID
   * @returns Array of tasks related to the user
   */
  async findByUser(userId: string): Promise<ITask[]> {
    return Task.find({
      $or: [{ creatorId: userId }, { assignedToId: userId }],
    });
  }

  /**
   * Finds overdue tasks for a user that are not completed.
   *
   * @param userId - User ID
   * @returns Array of overdue tasks assigned to the user
   */
  async findOverdue(userId: string): Promise<ITask[]> {
    const now = new Date();
    return Task.find({
      assignedToId: userId,
      dueDate: { $lt: now },
      status: { $ne: "Completed" },
    });
  }
}

/**
 * Singleton instance of TaskRepository for use in services.
 */
export const taskRepository = new TaskRepository();
