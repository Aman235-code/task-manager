import { Request, Response } from "express";

export function getProfile(req: Request, res: Response) {
  res.json({
    message: "Access granted",
    userId: req.user?.id
  });
}
