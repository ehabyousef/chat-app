import { Message } from "../../DB/models/message.model.js";
import cloudinary from "../../utils/cloudinary.js";

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
    res.status(201).json(sendMsg);
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};
