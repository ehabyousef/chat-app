import Joi from "joi";

export const FriendRequestValidation = Joi.object({
  senderId: Joi.string().required(),
  receiverId: Joi.string().required(),
});

export const respondToFriendRequest = Joi.object({
  senderId: Joi.string().required(),
  receiverId: Joi.string().required(),
  status: Joi.string().required(),
});
