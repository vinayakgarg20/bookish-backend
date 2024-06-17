import mongoose, { Document, Schema } from 'mongoose';
import { reviewSchema } from './review.model';
import { IBook } from '../types/interfaces/book.interface';
const bookSchema: Schema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String, required: true },
  genre: { type: String, required: true },
  coverImage: { type: String, required: true },
  averageRating: { type: Number, default: 0 },
  reviews: [reviewSchema],
});

export default mongoose.model<IBook & Document>('Book', bookSchema);