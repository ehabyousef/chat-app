import express from "express";
import { login, logout, register } from "./auth.controller.js";
import { Validator } from "../../middleware/validator.js";
import { loginvalidation, registervalidation } from "./auth.validation.js";
export const authRouter = express.Router();

authRouter.post("/register", Validator(registervalidation), register);
authRouter.post("/login", Validator(loginvalidation), login);
authRouter.post("/logout", logout);
