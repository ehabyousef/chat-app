import express from "express";
import { getMessages } from "./message.controller.js";
import { protectRoute } from "../../middleware/auth.middleware.js";

export const messageRouter = express.Router();

messageRouter.get("/:id", protectRoute, getMessages);
messageRouter.post("/send/:id",protectRoute,sendMessages)