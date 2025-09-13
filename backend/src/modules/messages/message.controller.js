import { Message } from "../../DB/models/message.model.js";

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
