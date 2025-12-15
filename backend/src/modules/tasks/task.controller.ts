import { Request, Response } from "express";
import { taskService } from "./task.service";
import { CreateTaskDto, UpdateTaskDto } from "./task.dto";

export async function createTask(req: Request, res: Response) {
  try {
    const data = CreateTaskDto.parse(req.body);
    const io = req.app.get("io");
    const task = await taskService.createTask(req.user!.id.toString(), data, io);
    res.status(201).json(task);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function getTask(req: Request, res: Response) {
  try {
    const task = await taskService.getTaskById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function getUserTasks(req: Request, res: Response) {
  try {
    const { tasks, overdueTasks } = await taskService.getTasksForUser(
      req.user!.id.toString()
    );
    res.json({ tasks, overdueTasks });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function updateTask(req: Request, res: Response) {
  try {
    const data = UpdateTaskDto.parse(req.body);
     const io = req.app.get("io");
    const updatedTask = await taskService.updateTask(
      req.params.id,
      req.user!.id.toString(),
      data,
      io
    );
    res.json(updatedTask);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function deleteTask(req: Request, res: Response) {
  try {
    const deletedTask = await taskService.deleteTask(
      req.params.id,
      req.user!.id.toString()
    );
    res.json({ message: "Task deleted", task: deletedTask });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}
