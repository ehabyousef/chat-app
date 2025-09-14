import express from "express";
import { Validator } from "../../middleware/validator.js";
import {
  authorizedRoute,
  protectRoute,
} from "../../middleware/auth.middleware.js";
import {
  getgetUsersForSidebar,
  updateUserProfile,
} from "./users.controller.js";
import { updateProfile } from "./user.validation.js";
export const userRouter = express.Router();

userRouter.get("/", protectRoute, getgetUsersForSidebar);
userRouter.get("/:id", protectRoute, getgetUsersForSidebar);
userRouter.put(
  "/update-profile",
  authorizedRoute,
  Validator(updateProfile),
  updateUserProfile
);
