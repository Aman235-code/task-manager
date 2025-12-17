import { Router } from "express";
import {
  getMyNotifications,
  markNotificationAsRead,
  markAllAsRead,
  deleteNotification,
} from "./notification.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/",  getMyNotifications);
router.patch("/:id/read", markNotificationAsRead);
router.patch("/read-all", markAllAsRead);
router.delete("/delete/:id", deleteNotification)

export default router;
