import jwt from "jsonwebtoken";
import User from "../DB/models/user.model.js";
export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      res.status(404).json({ message: "unauthorized - token not provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      res.status(404).json({ message: "unauthorized - invalid token" });
    }
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      res.status(404).json({ message: "user not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};

export const authorizedRoute = async (req, res, next) => {
  protectRoute(req, res, () => {
    if (req.user.id !== req.params.id) {
      res.status(403).json({ message: "you are not authorized " });
    } else {
      next();
    }
  });
};
