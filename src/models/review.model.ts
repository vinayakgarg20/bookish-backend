import mongoose, { Schema } from 'mongoose';
import { IReview } from '../types/interfaces/review.interface';

export const reviewSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String },
  isAuthorizedUser: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IReview & Document>('Review', reviewSchema);