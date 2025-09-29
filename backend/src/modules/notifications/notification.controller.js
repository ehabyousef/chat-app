import User from "../../DB/models/user.model.js";
import { FriendRequest } from "../../DB/models/friendRequest.model.js";
import { Notification } from "../../DB/models/notification.model.js";
import { getReciverSocketId, io } from "../../utils/socket.js";

// send FriendRequest
export const sendFriendRequest = async (req, res) => {
  try {
    const { friendId } = req.body;
    const myId = req.user._id;

    if (!friendId) {
      return res.status(400).json({ message: "Friend ID is required" });
    }

    if (myId.toString() === friendId.toString()) {
      return res
        .status(400)
        .json({ message: "Cannot send friend request to yourself" });
    }
    const me = await User.findById(myId);
    const isAlready = me.friends.some(
      (x) => x.friendId.toString() === friendId.toString()
    );

    if (isAlready) {
      return res.status(400).json({ message: "Already friends" });
    }

    const exist = await FriendRequest.findOne({
      $or: [
        { senderId: myId, receiverId: friendId },
        { senderId: friendId, receiverId: myId },
      ],
    });
    if (exist) {
      return res.status(400).json({ message: "Friend request already exists" });
    }

    const friendRequest = new FriendRequest({
      senderId: myId,
      receiverId: friendId,
    });

    await friendRequest.save();

    //create notification
    const notification = new Notification({
      senderId: myId,
      receiverId: friendId,
      type: "friend_request",
      message: `${me.fullName} send you friend request`,
      data: { friendRequestId: friendRequest._id },
    });

    await notification.save();

    //send real time notification
    const reciveSocket = getReciverSocketId(friendId);
    if (reciveSocket) {
      io.to(reciveSocket).emit("newNotification", {
        ...notification.toObject(),
        sender: {
          _id: me._id,
          fullName: me.fullName,
          profilePic: me.profilePic,
        },
      });
    }

    return res.status(201).json({
      message: "Friend request sent successfully",
      friendRequest,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const respondToFriendRequest = async (req, res) => {
  try {
    const { requestId, status } = req.body;
    const myId = req.user._id;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const friendRequest = await FriendRequest.findById(requestId).populate(
      "senderId",
      "fullName profilePic"
    );
    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    if (friendRequest.receiverId.toString() !== myId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    friendRequest.status = status;
    if (status === "accepted") {
      // Add both users to each other's friends list
      await Promise.all([
        User.findByIdAndUpdate(myId, {
          $addToSet: { friends: { friendId: friendRequest.senderId._id } },
        }),
        User.findByIdAndUpdate(friendRequest.senderId._id, {
          $addToSet: { friends: { friendId: myId } },
        }),
      ]);
      const currentUser = await User.findById(myId);

      const notification = new Notification({
        senderId: myId,
        receiverId: friendRequest.senderId._id,
        type: "friend_accepted",
        message: `${currentUser.fullName} accepted your friend request`,
      });

      await notification.save();

      // Send real-time notification
      const senderSocketId = getReciverSocketId(
        friendRequest.senderId._id.toString()
      );
      if (senderSocketId) {
        io.to(senderSocketId).emit("newNotification", {
          ...notification.toObject(),
          sender: {
            _id: currentUser._id,
            fullName: currentUser.fullName,
            profilePic: currentUser.profilePic,
          },
        });
      }
    }

    return res.status(200).json({ message: `Friend request ${status}` });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getFriendRequests = async (req, res) => {
  try {
    const myId = req.user._id;

    const requests = await FriendRequest.find({
      receiverId: myId,
      status: "pending",
    })
      .populate("senderId", "fullName email profilePic")
      .sort({ createdAt: -1 });

    return res.status(200).json(requests);
  } catch (error) {
    console.error("Get friend requests error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const myId = req.user._id;
    const notifications = await Notification.find({
      receiverId: myId,
    })
      .populate("senderId", "fullName profilePic")
      .sort({ createdAt: -1 })
      .limit(20);
    return res.status(200).json(notifications);
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
};
