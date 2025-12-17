import { Request, Response } from "express";
import { ZodError } from "zod";
import { RegisterDto, LoginDto } from "./auth.dto";
import { registerUser, loginUser } from "./auth.service";
import { HttpError } from "../../utils/httpError";

/**
 * Registers a new user.
 *
 * Parses and validates the request body, creates a new user,
 * issues a JWT, and sets it as an HTTP-only cookie.
 *
 * @param req - Express request object
 * @param res - Express response object
 *
 * @returns 201 Created with user info on success
 * @returns 400 Bad Request if validation fails
 * @returns 4xx for controlled errors via HttpError
 * @returns 500 Internal Server Error for unexpected failures
 */
export async function register(req: Request, res: Response) {
  try {
    const data = RegisterDto.parse(req.body);

    const { user, token } = await registerUser(
      data.name,
      data.email,
      data.password
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
    });

    return res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
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
      message: "Something went wrong",
    });
  }
}

/**
 * Logs in an existing user.
 *
 * Parses and validates the request body, checks credentials,
 * issues a JWT, and sets it as an HTTP-only cookie.
 *
 * @param req - Express request object
 * @param res - Express response object
 *
 * @returns 200 OK with user info on success
 * @returns 400 Bad Request if validation fails
 * @returns 4xx for controlled errors via HttpError
 * @returns 500 Internal Server Error for unexpected failures
 */
export async function login(req: Request, res: Response) {
  try {
    const data = LoginDto.parse(req.body);

    const { user, token } = await loginUser(data.email, data.password);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
    });

    return res.json({
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
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
      message: "Something went wrong",
    });
  }
}

/**
 * Logs out the current user by clearing the JWT cookie.
 *
 * @param req - Express request object
 * @param res - Express response object
 *
 * @returns 200 OK with logout confirmation
 */
export function logout(req: Request, res: Response) {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
  });

  return res.status(200).json({
    message: "Logged out successfully",
  });
}
