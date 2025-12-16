import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { getAllUsers, getProfile, updateName } from "./user.controller";

const router = Router();

router.get("/me", authMiddleware, getProfile);
router.patch("/me", authMiddleware, updateName);
router.get("/all", getAllUsers);

export default router;
