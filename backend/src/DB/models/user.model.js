import mongoose from "mongoose";

const friendSchema = new mongoose.Schema(
  {
    friendId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    addedAt: { type: Date, default: Date.now() },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      default: "",
    },
    friends: [friendSchema],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
