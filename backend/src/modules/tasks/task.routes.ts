import { Router } from "express";
import {
  createTask,
  getTask,
  getUserTasks,
  updateTask,
  deleteTask
} from "./task.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.post("/", createTask);
router.get("/", getUserTasks);
router.get("/:id", getTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
