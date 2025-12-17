import { Router } from "express";
import { login, logout, register } from "./auth.controller";

/**
 * Express router for authentication-related endpoints.
 *
 * Routes included:
 * - POST /register: Register a new user
 * - POST /login: Authenticate an existing user
 * - POST /logout: Clear user session / JWT cookie
 */
const router = Router();

/**
 * Register a new user.
 * Expects body validated by RegisterDto.
 */
router.post("/register", register);

/**
 * Authenticate a user and set JWT cookie.
 * Expects body validated by LoginDto.
 */
router.post("/login", login);

/**
 * Logout a user by clearing the JWT cookie.
 */
router.post("/logout", logout);

export default router;
