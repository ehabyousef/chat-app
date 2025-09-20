import Joi from "joi";

export const messageValidation = Joi.object({
  text: Joi.string().optional(),
  image: Joi.string().trim().allow("", null).optional(),
});
