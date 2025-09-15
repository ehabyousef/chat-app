import Joi from "joi";

export const updateProfileValidation = Joi.object({
  fullName: Joi.string().trim().min(2).max(50).optional(),
  email: Joi.string().trim().email().optional(),
  // Allow empty string or null so requests without an image pass validation
  profilePic: Joi.string().trim().allow("", null).optional(),
});
