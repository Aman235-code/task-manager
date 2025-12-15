import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { getProfile, updateName } from "./user.controller";

const router = Router();

router.get("/me", authMiddleware, getProfile);
router.patch("/me", authMiddleware, updateName);

export default router;
