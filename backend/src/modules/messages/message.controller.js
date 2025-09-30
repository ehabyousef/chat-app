import { Message } from "../../DB/models/message.model.js";
import { Notification } from "../../DB/models/notification.model.js";
import User from "../../DB/models/user.model.js";
import cloudinary from "../../utils/cloudinary.js";
import { getReciverSocketId, io } from "../../utils/socket.js";

export const getMessages = async (req, res) => {
  try {
    const { id: userChatID } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userChatID },
        { senderId: userChatID, receiverId: myId },
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};

export const sendMessages = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: userChatID } = req.params;
    const myId = req.user._id;
    let imageurl;

    if (image) {
      const uploadedUrl = await cloudinary.uploader.upload(image);
      imageurl = uploadedUrl.secure_url;
    }

    const sendMsg = new Message({
      senderId: myId,
      receiverId: userChatID,
      image: imageurl,
      text,
    });

    await sendMsg.save();

    const reciverId = getReciverSocketId(userChatID);
    if (reciverId) {
      io.to(reciverId).emit("newMessage", sendMsg);
    }
    const currentUser = await User.findById(myId);

    const notification = new Notification({
      senderId: myId,
      receiverId: userChatID,
      type: "message",
      data: { messageId: sendMsg._id },
      message: `new message from ${currentUser.fullName}`,
    });

    await notification.save();

    // send real time notification
    const recive = getReciverSocketId(userChatID);
    if (recive) {
      io.to(recive).emit("newNotification", {
        ...notification.toObject(),
        sender: {
          _id: currentUser._id,
          fullName: currentUser.fullName,
          profilePic: currentUser.profilePic,
        },
      });
    }

    return res.status(201).json(sendMsg);
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "message id is required" });
    }
    await Message.findByIdAndDelete(id);
    res.status(200).json({ message: "message deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};
