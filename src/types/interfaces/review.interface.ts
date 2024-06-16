export interface IReview {
    _id: string;
    userId: string;
    username: string;
    rating: number;
    comment?: string;
    createdAt?: Date;
}