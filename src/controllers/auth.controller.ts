import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    res.status(201).json({ token, username: newUser.username });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });
    res.json({ token, username: user.username });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
