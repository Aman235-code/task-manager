import { Request, Response } from "express";
import { ZodError } from "zod";
import { RegisterDto, LoginDto } from "./auth.dto";
import { registerUser, loginUser } from "./auth.service";
import { HttpError } from "../../utils/httpError";

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
      sameSite: "lax"
    });

    return res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email
    });
  } catch (err) {
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
      message: "Something went wrong"
    });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const data = LoginDto.parse(req.body);

    const { user, token } = await loginUser(data.email, data.password);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax"
    });

    return res.json({
      id: user._id,
      name: user.name,
      email: user.email
    });
  } catch (err) {
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
      message: "Something went wrong"
    });
  }
}

export function logout(req: Request, res: Response) {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax"
  });

  return res.status(200).json({
    message: "Logged out successfully"
  });
}
