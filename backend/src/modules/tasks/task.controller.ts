import { Request, Response } from "express";
import { ZodError } from "zod";
import { taskService } from "./task.service";
import { CreateTaskDto, UpdateTaskDto } from "./task.dto";
import { HttpError } from "../../utils/httpError";

/**
 * Handles errors in task controllers and sends appropriate HTTP responses.
 *
 * @param res - Express response object
 * @param err - The caught error
 * @returns HTTP response with status code and message
 */
function handleError(res: Response, err: unknown) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Invalid request data",
      errors: err.errors,
    });
  }

  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  console.error(err);
  return res.status(500).json({
    message: "Internal server error",
  });
}

/**
 * Creates a new task for the authenticated user.
 *
 * @param req - Express request object, expects `req.user.id` and valid body
 * @param res - Express response object
 *
 * @returns 201 Created with the created task
 * @throws 400 if validation fails
 * @throws 4xx for controlled errors via HttpError
 * @throws 500 Internal server error for unexpected failures
 */
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

/**
 * Retrieves a task by its ID.
 *
 * @param req - Express request object, expects `req.params.id`
 * @param res - Express response object
 *
 * @returns The task object
 */
export async function getTask(req: Request, res: Response) {
  try {
    const task = await taskService.getTaskById(req.params.id);
    res.json(task);
  } catch (err) {
    handleError(res, err);
  }
}

/**
 * Retrieves all tasks for the authenticated user.
 *
 * @param req - Express request object, expects `req.user.id`
 * @param res - Express response object
 *
 * @returns Array of task objects
 */
export async function getUserTasks(req: Request, res: Response) {
  try {
    const data = await taskService.getTasksForUser(req.user!.id.toString());
    res.json(data);
  } catch (err) {
    handleError(res, err);
  }
}

/**
 * Updates a task by ID for the authenticated user.
 *
 * @param req - Express request object, expects `req.user.id`, `req.params.id`, and valid body
 * @param res - Express response object
 *
 * @returns The updated task object
 */
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

/**
 * Deletes a task by ID for the authenticated user.
 *
 * @param req - Express request object, expects `req.user.id` and `req.params.id`
 * @param res - Express response object
 *
 * @returns Confirmation message and deleted task object
 */
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
