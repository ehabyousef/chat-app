import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema(
  {
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["friend_request", "friend_accepted", "friend_rejected", "message"],
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    data: {
      friendRequestId: { type: Schema.Types.ObjectId, ref: "FriendRequest" },
      messageId: { type: Schema.Types.ObjectId, ref: "Message" },
    },
    message: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const Notification = mongoose.model("Notification", notificationSchema);
