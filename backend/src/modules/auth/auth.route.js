import express from "express";
import {
  checkAuth,
  login,
  logout,
  register,
  refreshAuth,
} from "./auth.controller.js";
import { Validator } from "../../middleware/validator.js";
import { loginvalidation, registervalidation } from "./auth.validation.js";
import { protectRoute } from "../../middleware/auth.middleware.js";
export const authRouter = express.Router();

authRouter.post("/register", Validator(registervalidation), register);
authRouter.post("/login", Validator(loginvalidation), login);
authRouter.post("/logout", logout);
authRouter.get("/check", protectRoute, checkAuth);
authRouter.post("/refresh", protectRoute, refreshAuth);
