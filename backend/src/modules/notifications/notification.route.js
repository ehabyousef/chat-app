import express from "express";
import { protectRoute } from "../../middleware/auth.middleware.js";
import {
  getFriendRequests,
  getNotifications,
  getSentRequests,
  readNotification, // Add this import
  respondToFriendRequest,
  sendFriendRequest,
} from "./notification.controller.js";

export const notificationRouter = express.Router();

notificationRouter.get("/", protectRoute, getNotifications);
notificationRouter.get("/FriendRequests", protectRoute, getFriendRequests);
notificationRouter.get("/sent-requests", protectRoute, getSentRequests); // Add this route
notificationRouter.post("/FriendRequest", protectRoute, sendFriendRequest);
notificationRouter.post("/respond", protectRoute, respondToFriendRequest);
notificationRouter.put(
  "/:notificationId/markRead",
  protectRoute,
  readNotification
);
