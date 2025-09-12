import bcrypt from "bcryptjs";
import User from "../../DB/models/user.model.js";
import { generateToken } from "../../utils/genToken.js";

export const register = async (req, res) => {
  const { email, fullName, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "this user already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const newUser = new User({
      email,
      fullName,
      password: hash,
    });
    if (newUser) {
      await newUser.save();
      generateToken(newUser._id, res);

      console.log("register: sending response");
      res.status(201).json({
        email: newUser.email,
        fullName: newUser.fullName,
        profilePic: newUser.profilePic,
      });
    }
  } catch (error) {
    console.error(`error in signup controller:`, error);
    res.status(500).json({ message: "internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "no user found" });
    }
    const ispass = await bcrypt.compare(password, user.password);
    if (!ispass) {
      res.status(400).json({ message: "invalid credentails" });
    }
    generateToken(user._id, res);
    res.status(200).json({
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error(`error in signup controller:`, error);
    res.status(500).json({ message: "internal server error" });
  }
};
