import express from "express";
import {
 createNotification,
 getNotificationsByReceiver,
 deleteNotification,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.post("/notification/add", createNotification);
router.get("/notification/:receiverId", getNotificationsByReceiver);
router.delete("/notification/:id", deleteNotification);

export default router;
