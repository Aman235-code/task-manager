import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

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

    req.user = {
      id: decoded.userId as any
    };

    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}
