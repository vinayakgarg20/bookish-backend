import { Document, Types } from 'mongoose';
import { IReview } from './review.interface';

interface IBookData {
  title: string;
  author: string;
  description?: string;
  genre: string;
  coverImage: string;
  averageRating: number;
  reviews: IReview[];
}

interface IBookDocument extends IBookData {
  _id: string;
  save(): Promise<this>;
  toObject(): this & IBookData;
}

export interface IBook extends IBookDocument {}