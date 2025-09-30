import express from "express";
import { Validator } from "../../middleware/validator.js";
import {
  authorizedRoute,
  protectRoute,
} from "../../middleware/auth.middleware.js";
import {
  // addFriend,
  appUsers,
  getFriends,
  getSingleuser,
  updateUserProfile,
} from "./users.controller.js";
import { updateProfileValidation } from "./users.validation.js";
export const userRouter = express.Router();

userRouter.get("/friends", protectRoute, getFriends);
userRouter.get("/appUsers", protectRoute, appUsers);
userRouter.get("/:id", protectRoute, getSingleuser);
userRouter.put(
  "/update-profile/:id",
  authorizedRoute,
  Validator(updateProfileValidation),
  updateUserProfile
);
// userRouter.put("/addFriend", protectRoute, addFriend);
