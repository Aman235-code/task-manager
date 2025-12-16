import { Router } from "express";
import {
  getMyNotifications,
  markNotificationAsRead,
  markAllAsRead,
} from "./notification.controller";

const router = Router();

router.get("/",  getMyNotifications);
router.patch("/:id/read", markNotificationAsRead);
router.patch("/read-all", markAllAsRead);

export default router;
