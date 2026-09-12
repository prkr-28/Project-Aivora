import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import config from "../config/env.js";
export const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      res.status(401).json({
        error: "No authentication token, access denied",
      });
      return;
    }

    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);

    // Find user
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      res.status(401).json({
        error: "User not found",
      });
      return;
    }

    // Attach user to request
    req.user = user;
    req.userId = String(user._id);
    next();
  } catch (error) {
    res.status(401).json({
      error: "Token is not valid",
    });
  }
};
export const generateToken = (userId) => {
  return jwt.sign(
    {
      userId,
    },
    config.jwtSecret,
    {
      expiresIn: config.jwtExpiresIn,
    },
  );
};
