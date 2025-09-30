import User from "../../DB/models/user.model.js";
import { FriendRequest } from "../../DB/models/friendRequest.model.js";
import { Notification } from "../../DB/models/notification.model.js";
import { getReciverSocketId, io } from "../../utils/socket.js";

// send FriendRequest
export const sendFriendRequest = async (req, res) => {
  try {
    console.log("Send friend request - Body:", req.body);
    console.log("Send friend request - User ID:", req.user?._id);

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
    if (!me) {
      return res.status(404).json({ message: "User not found" });
    }

    const friend = await User.findById(friendId);
    if (!friend) {
      return res.status(404).json({ message: "Friend not found" });
    }

    // Check if already friends
    const isAlready = me.friends.some(
      (x) => x.friendId.toString() === friendId.toString()
    );

    if (isAlready) {
      return res.status(400).json({ message: "Already friends" });
    }

    // Only check for PENDING friend requests, ignore rejected ones
    const existingPendingRequest = await FriendRequest.findOne({
      $or: [
        { senderId: myId, receiverId: friendId },
        { senderId: friendId, receiverId: myId },
      ],
      status: "pending", // Only check for pending requests
    });

    if (existingPendingRequest) {
      return res
        .status(400)
        .json({ message: "Friend request already pending" });
    }

    // Check if there's a previous rejected request and delete it
    await FriendRequest.deleteMany({
      $or: [
        { senderId: myId, receiverId: friendId },
        { senderId: friendId, receiverId: myId },
      ],
      status: "rejected", // Delete old rejected requests
    });

    // Create new friend request
    const friendRequest = new FriendRequest({
      senderId: myId,
      receiverId: friendId,
    });

    await friendRequest.save();

    // Create notification
    const notification = new Notification({
      senderId: myId,
      receiverId: friendId,
      type: "friend_request",
      message: `${me.fullName} sent you a friend request`,
      data: { friendRequestId: friendRequest._id },
    });

    await notification.save();

    // Send real-time notification
    const receiveSocket = getReciverSocketId(friendId);
    if (receiveSocket) {
      io.to(receiveSocket).emit("newNotification", {
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
    console.error("Send friend request error:", error);
    console.error("Error stack:", error.stack);
    return res.status(500).json({
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const respondToFriendRequest = async (req, res) => {
  try {
    const { requestId, status, notificationId } = req.body;
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

    // Update friend request status
    friendRequest.status = status;
    await friendRequest.save();

    // Get current user info
    const currentUser = await User.findById(myId);

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

      // Update the original notification type and message
      let updatedNotification;
      if (notificationId) {
        updatedNotification = await Notification.findByIdAndUpdate(
          notificationId,
          {
            type: "friend_accepted",
            message: `${currentUser.fullName} accepted your friend request`,
            isRead: true,
          },
          { new: true }
        ).populate("senderId", "fullName profilePic");
      }

      // Send real-time notification with updated notification
      const senderSocketId = getReciverSocketId(
        friendRequest.senderId._id.toString()
      );
      if (senderSocketId && updatedNotification) {
        io.to(senderSocketId).emit("notificationUpdated", {
          ...updatedNotification.toObject(),
          sender: {
            _id: currentUser._id,
            fullName: currentUser.fullName,
            profilePic: currentUser.profilePic,
          },
        });
      }
    } else if (status === "rejected") {
      // Update the original notification type and message
      let updatedNotification;
      if (notificationId) {
        updatedNotification = await Notification.findByIdAndUpdate(
          notificationId,
          {
            type: "friend_rejected",
            message: `${currentUser.fullName} rejected your friend request`,
            isRead: true,
          },
          { new: true }
        ).populate("senderId", "fullName profilePic");
      }

      // Send real-time notification with updated notification
      const senderSocketId = getReciverSocketId(
        friendRequest.senderId._id.toString()
      );
      if (senderSocketId && updatedNotification) {
        io.to(senderSocketId).emit("notificationUpdated", {
          ...updatedNotification.toObject(),
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
    console.error("Respond to friend request error:", error);
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

export const getSentRequests = async (req, res) => {
  try {
    const myId = req.user._id;

    const sentRequests = await FriendRequest.find({
      senderId: myId,
      status: "pending",
    })
      .populate("receiverId", "fullName email profilePic")
      .sort({ createdAt: -1 });

    return res.status(200).json(sentRequests);
  } catch (error) {
    console.error("Get sent requests error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const readNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const myId = req.user._id;

    if (!notificationId) {
      return res.status(400).json({ message: "Notification ID is required" });
    }

    const notification = await Notification.findByIdAndUpdate(
      {
        _id: notificationId,
        receiverId: myId,
      },
      { isRead: true },
      { new: true }
    ).populate("senderId", "fullName profilePic");

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    return res.status(200).json({
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
