import { Task, ITask } from "./task.model";
import { Types } from "mongoose";

export class TaskRepository {
  async create(taskData: Partial<ITask>): Promise<ITask> {
    const task = await Task.create(taskData);
    return task;
  }

  async findById(id: string): Promise<ITask | null> {
    return Task.findById(id);
  }

  async findAll(): Promise<ITask[]> {
    return Task.find();
  }

  async update(id: string, data: Partial<ITask>): Promise<ITask | null> {
    return Task.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<ITask | null> {
    return Task.findByIdAndDelete(id);
  }

  async findByUser(userId: string): Promise<ITask[]> {
    return Task.find({
      $or: [{ creatorId: userId }, { assignedToId: userId }]
    });
  }

  async findOverdue(userId: string): Promise<ITask[]> {
    const now = new Date();
    return Task.find({
      assignedToId: userId,
      dueDate: { $lt: now },
      status: { $ne: "Completed" }
    });
  }
}

export const taskRepository = new TaskRepository();
