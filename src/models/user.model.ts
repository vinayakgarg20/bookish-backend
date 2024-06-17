import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "../types/interfaces/user.interface";

const userSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IUser & Document>("User", userSchema);
