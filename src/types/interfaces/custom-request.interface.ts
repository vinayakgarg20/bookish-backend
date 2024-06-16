import { Request } from 'express';
import { IUser } from './user.interface';

export interface CustomRequest extends Request {
  user?: IUser;
}