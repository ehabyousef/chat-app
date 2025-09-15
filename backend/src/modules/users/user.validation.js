import Joi from "joi";

export const updateProfile = Joi.object({
  fullName: Joi.string().min(3).optional(),
  password: Joi.string().min(6).optional(),
  email: Joi.string().email().optional(),
  profilePic: Joi.string().optional(),
});
