import Joi from "joi";
export const registervalidation = Joi.object({
  fullName: Joi.string().min(3).required(),
  password: Joi.string().min(6).required(),
  email: Joi.string().email().required(),
});
export const loginvalidation = Joi.object({
  password: Joi.string().min(6).required(),
  email: Joi.string().email().required(),
});
