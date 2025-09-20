import express from "express";
import { Validator } from "../../middleware/validator.js";
import {
  authorizedRoute,
  protectRoute,
} from "../../middleware/auth.middleware.js";
import {
  getSingleuser,
  getUsersForSidebar,
  updateUserProfile,
} from "./users.controller.js";
import { updateProfileValidation } from "./users.validation.js";
export const userRouter = express.Router();

userRouter.get("/friends", protectRoute, getUsersForSidebar);
userRouter.get("/:id", protectRoute, getSingleuser);
userRouter.put(
  "/update-profile/:id",
  authorizedRoute,
  Validator(updateProfileValidation),
  updateUserProfile
);
