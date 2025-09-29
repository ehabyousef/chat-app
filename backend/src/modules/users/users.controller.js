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

// export const addFriend = async (req, res) => {
//   try {
//     const { friendId } = req.body;
//     const myId = req.user._id;
//     const me = await User.findById(myId);
//     if (!friendId) {
//       res.status(404).json({ message: "user Id required" });
//     }
//     const isAlreadyFriend = me.friends.some(
//       (x) => x.friendId.toString() === friendId.toString()
//     );
//     if (isAlreadyFriend) {
//       res.status(400).json({ message: "user is already friend" });
//     }
//     await User.findByIdAndUpdate(
//       myId,
//       {
//         $addToSet: {
//           friends: { friendId },
//         },
//       },
//       { new: true }
//     );
//     await User.findByIdAndUpdate(
//       friendId,
//       {
//         $addToSet: {
//           friends: { friendId: myId },
//         },
//       },
//       { new: true }
//     );
//     res.status(200).json({ message: "user add to friends" });
//   } catch (error) {
//     res.status(500).json({ message: "internal server error" });
//   }
// };

export const getFriends = async (req, res) => {
  try {
    const userId = req.user._id;
    const me = await User.findById(userId)
      .populate({
        path: "friends.friendId",
        select: "_id fullName email profilePic",
      })
      .select("friends -_id");

    const friends = (me.friends || []).map((f) => f.friendId).filter(Boolean);
    res.status(200).json(friends);
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};

export const appUsers = async (req, res) => {
  try {
    const myId = req.user._id;
    const term = (req.query.search ?? "").trim();
    const regex = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const currentUser = await User.findById(myId).select("friends");
    const friendIds = currentUser.friends.map((friend) => friend.friendId);
    const users = await User.find(
      regex
        ? {
            _id: { $ne: myId, $nin: friendIds },
            $or: [
              { fullName: { $regex: regex } },
              { email: { $regex: regex } },
            ],
          }
        : { _id: { $ne: myId } }
    )
      .select("-password")
      .limit(50);

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
};
