import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { CustomRequest } from "../types/interfaces/custom-request.interface";

export const authenticate = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return next();
    }

    jwt.verify(token, process.env.JWT_SECRET!, async (err, decoded) => {
      if (err) {
        return next();
      }

      const userId = (decoded as { userId: string }).userId;
      const user = await User.findById(userId);

      if (!user) {
        return next();
      }

      req.user = user;
      next();
    });
  } catch (error) {
    console.error("Error authenticating user:", error);
    next();
  }
};