import { Router } from "express";
import {
  createTask,
  getTask,
  getUserTasks,
  updateTask,
  deleteTask,
} from "./task.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

/**
 * Express router for task-related endpoints.
 *
 * All routes require authentication via `authMiddleware`.
 */
const router = Router();

// Apply authentication middleware to all task routes
router.use(authMiddleware);

/**
 * POST /api/v1/tasks
 * Create a new task for the authenticated user.
 */
router.post("/", createTask);

/**
 * GET /api/v1/tasks
 * Retrieve all tasks for the authenticated user.
 */
router.get("/", getUserTasks);

/**
 * GET /api/v1/tasks/:id
 * Retrieve a single task by its ID.
 */
router.get("/:id", getTask);

/**
 * PUT /api/v1/tasks/:id
 * Update a task by its ID for the authenticated user.
 */
router.put("/:id", updateTask);

/**
 * DELETE /api/v1/tasks/:id
 * Delete a task by its ID for the authenticated user.
 */
router.delete("/:id", deleteTask);

export default router;
