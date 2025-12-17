import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import {
  getAllUsers,
  getProfile,
  getSingleUser,
  updateName,
} from "./user.controller";

/**
 * Express router for user-related endpoints.
 */
const router = Router();

/**
 * GET /api/v1/users/me
 * Retrieve the profile of the currently authenticated user.
 * Requires authentication.
 */
router.get("/me", authMiddleware, getProfile);

/**
 * PATCH /api/v1/users/me
 * Update the name of the currently authenticated user.
 * Requires authentication.
 */
router.patch("/me", authMiddleware, updateName);

/**
 * GET /api/v1/users/all
 * Retrieve a list of all users.
 */
router.get("/all", getAllUsers);

/**
 * GET /api/v1/users/:id
 * Retrieve a single user by their ID.
 */
router.get("/:id", getSingleUser);

export default router;
