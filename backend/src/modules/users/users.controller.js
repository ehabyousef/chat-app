import cloudinary from "../../utils/cloudinary.js";
import User from "../../DB/models/user.model.js";

export const updateUserProfile = async (req, res) => {
  const { email, fullName, profilePic } = req.body;
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "user not found" });
    }

    let imageUrl = user.profilePic;
    if (profilePic) {
      const uploadResponse = await cloudinary.uploader.upload(profilePic, {
        folder: "profile_pictures",
      });
      imageUrl = uploadResponse.secure_url;
    }

    const updateuser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: imageUrl,
        fullName,
        email,
      },
      { new: true }
    ).select("_id fullName email profilePic");

    res.status(200).json(updateuser);
  } catch (error) {}
  res.status(500).json({ message: "internal server error" });
};

export const getUsersForSidebar = async (req, res) => {
  try {
    const userId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: userId } }).select(
      "-password"
    );
    res.status(200).json(filteredUsers);
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};

export const getSingleuser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "user not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};
