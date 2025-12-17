import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

/**
 * Express middleware for authenticating requests using JWT.
 *
 * Checks for a token in cookies and verifies it.
 * If valid, attaches `req.user` with the user ID for downstream handlers.
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Function to pass control to the next middleware
 *
 * @returns 401 Unauthorized if no token is present
 * @returns 401 Invalid token if verification fails
 */
export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = verifyToken(token) as { userId: string };

    // Attach authenticated user information to the request object
    req.user = {
      id: decoded.userId as any, // could be string or ObjectId depending on app
    };

    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}
