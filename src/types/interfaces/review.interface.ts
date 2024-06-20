export interface IReviewData {
    userId: string;
    username: string;
    rating: number;
    comment?: string;
    isAuthorizedUser?: boolean;
    createdAt?: Date;
  }
  
  interface IReviewDocument extends IReviewData {
    _id: string;
    toObject(): this & IReviewData;
  }
  
  export interface IReview extends IReviewDocument {}