import express from "express";
import { login, logout, register, updateProfile } from "./auth.controller.js";
import { Validator } from "../../middleware/validator.js";
import { loginvalidation, registervalidation, updateProdile } from "./auth.validation.js";
import { authorizedRoute } from "../../middleware/auth.middleware.js";

export const authRouter = express.Router();

authRouter.post("/register", Validator(registervalidation), register);
authRouter.post("/login", Validator(loginvalidation), login);
authRouter.post("/logout", logout);
