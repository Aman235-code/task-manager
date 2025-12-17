import { z } from "zod";

/**
 * Data Transfer Object for user registration.
 *
 * Validates incoming request body for the `register` endpoint.
 *
 * @property name - User's full name (minimum 2 characters)
 * @property email - User's email address (must be valid format)
 * @property password - User's password (minimum 6 characters)
 */
export const RegisterDto = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(6),
});

/**
 * Data Transfer Object for user login.
 *
 * Validates incoming request body for the `login` endpoint.
 *
 * @property email - User's email address (must be valid format)
 * @property password - User's password
 */
export const LoginDto = z.object({
  email: z.email(),
  password: z.string(),
});
