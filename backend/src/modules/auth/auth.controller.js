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

    await newUser.save();
    generateToken(newUser._id, res);

    return res.status(201).json({
      email: newUser.email,
      fullName: newUser.fullName,
      profilePic: newUser.profilePic,
      _id: newUser._id,
    });
  } catch (error) {
    console.error(`error in signup controller:`, error);
    return res.status(500).json({ message: "internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "no user found" });
    }
    const ispass = await bcrypt.compare(password, user.password);
    if (!ispass) {
      return res.status(400).json({ message: "invalid credentials" });
    }
    generateToken(user._id, res);
    return res.status(200).json({
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      _id: user._id,
    });
  } catch (error) {
    console.error(`error in login controller:`, error);
    return res.status(500).json({ message: "internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    return res.status(200).json({ message: "logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = req.user;
    if (user) {
      return res.status(200).json(req.user);
    } else {
      return res.status(401).json({ message: "not authorized" });
    }
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
};
export const refreshAuth = async (req, res) => {
  try {
    const user = req.user;

    generateToken(user._id, res);
    res.status(200).json(req.user);
  } catch {
    res.status(500).json({ message: "Failed to refresh authentication" });
  }
};
