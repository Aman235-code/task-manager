import { Request, Response } from "express";
import { ZodError } from "zod";
import { taskService } from "./task.service";
import { CreateTaskDto, UpdateTaskDto } from "./task.dto";
import { HttpError } from "../../utils/httpError";

function handleError(res: Response, err: unknown) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Invalid request data",
      errors: err.errors
    });
  }

  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      message: err.message
    });
  }

  console.error(err);
  return res.status(500).json({
    message: "Internal server error"
  });
}

export async function createTask(req: Request, res: Response) {
  try {
    const data = CreateTaskDto.parse(req.body);
    const io = req.app.get("io");

    const task = await taskService.createTask(req.user!.id, data, io);
    res.status(201).json(task);
  } catch (err) {
    handleError(res, err);
  }
}

export async function getTask(req: Request, res: Response) {
  try {
    const task = await taskService.getTaskById(req.params.id);
    res.json(task);
  } catch (err) {
    handleError(res, err);
  }
}

export async function getUserTasks(req: Request, res: Response) {
  try {
    const data = await taskService.getTasksForUser(req.user!.id.toString());
    res.json(data);
  } catch (err) {
    handleError(res, err);
  }
}

export async function updateTask(req: Request, res: Response) {
  try {
    const data = UpdateTaskDto.parse(req.body);
    const io = req.app.get("io");

    const task = await taskService.updateTask(
      req.params.id,
      req.user!.id.toString(),
      data,
      io
    );

    res.json(task);
  } catch (err) {
    handleError(res, err);
  }
}

export async function deleteTask(req: Request, res: Response) {
  try {
    const io = req.app.get("io");

    const task = await taskService.deleteTask(
      req.params.id,
      req.user!.id.toString(),
      io
    );

    res.json({ message: "Task deleted", task });
  } catch (err) {
    handleError(res, err);
  }
}
