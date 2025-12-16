import { Request, Response } from "express";
import { updateUserName } from "./user.service";
import { User } from "./user.model";

export async function getProfile(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(userId).select("-password"); // exclude password
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

export async function updateName(req: Request, res: Response) {
  const { name } = req.body;

  if (!name || name.trim().length === 0) {
    return res.status(400).json({ message: "Name is required" });
  }

  if (!req.user?.id) {
  return res.status(401).json({ message: "Unauthorized" });
}

  try {
    const user = await updateUserName(req.user.id.toString(), name.trim());

    return res.json({
      id: user._id,
      name: user.name,
      email: user.email
    });
  } catch (err) {
    if (err instanceof Error) {
    return res.status(500).json({ message: err.message });
  }
    return res.status(500).json({ message: "Server error" });
  }
}

export async function getAllUsers(req: Request, res: Response) {
  try {
    const users = await User.find()
    return res.status(200).json({users})
  } catch (err) {
     if (err instanceof Error) {
    return res.status(500).json({ message: err.message });
  }
    return res.status(500).json({ message: "Server error" });
  }
}