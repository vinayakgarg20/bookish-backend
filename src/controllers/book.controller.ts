import { Response } from "express";
import Book from "../models/book.model";
import User from "../models/user.model";

import mongoose from "mongoose";
import { IBook } from "../types/interfaces/book.interface";
import { CustomRequest } from "../types/interfaces/custom-request.interface";
import { IReview } from "../types/interfaces/review.interface";
export const getBooks = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = 'title',
      order = 'asc',
      title,
      author,
      genre,
      status,
    } = req.query;
    const userId = req.user?._id;

    // Validate and sanitize the query parameters
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber < 1 || limitNumber < 1) {
      res.status(400).json({ error: 'Invalid pagination parameters' });
      return;
    }

    const query: any = {};
    if (title && typeof title === 'string') {
      query.title = { $regex: title, $options: 'i' };
    }
    if (author && typeof author === 'string') {
      query.author = { $regex: author, $options: 'i' };
    }
    if (genre && typeof genre === 'string') {
      query.genre = { $regex: genre, $options: 'i' };
    }

    if (status === 'FAV') {
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      query._id = { $in: user.favorites };
    }

    const books: IBook[] = await Book.find(query)
      // .sort({ [sort as string]: order })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    let updatedBooks: IBook[] = [];

    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        updatedBooks = books.map((book) => ({
          ...book.toObject(),
          isFavorite: user.favorites.some(
            (favoriteId) => favoriteId.toString() === book._id.toString()
          ),
        }));
      }
    } else {
      updatedBooks = books.map((book) => ({
        ...book.toObject(),
        isFavorite: false,
      }));
    }

    res.json(updatedBooks);
  } catch (error) {
    console.error('Error getting books:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getBookById = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    // Validate the book ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: 'Invalid book ID' });
      return;
    }

    const book: IBook | null = await Book.findById(id).populate('reviews');
    if (!book) {
      res.status(404).json({ error: 'Book not found' });
      return;
    }

    const isFavorite = userId
      ? (await User.findById(userId))?.favorites.some(
          (favoriteId) => favoriteId.toString() === book._id.toString()
        ) || false
      : false;

    res.json({ ...book.toObject(), isFavorite });
  } catch (error) {
    console.error('Error getting book:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createBooks = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    // Check if the user is authenticated and has admin privileges
    if (!req.user) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    const booksData: IBook[] = req.body;

    // Validate the request body
    if (!Array.isArray(booksData) || booksData.length === 0) {
      res.status(400).json({ error: "Invalid books data" });
      return;
    }

    const newBooks: IBook[] = booksData.map((bookData) => {
      return new Book({
        title: bookData.title,
        author: bookData.author,
        description: bookData.description,
        genre: bookData.genre,
        coverImage: bookData.coverImage,
        averageRating:bookData.averageRating,
      });
    });

    const savedBooks = await Book.insertMany(newBooks);

    res.status(201).json(savedBooks);
  } catch (error) {
    console.error("Error creating books:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const toggleFavorite = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    // Validate the book ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: "Invalid book ID" });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const book: IBook | null = await Book.findById(id);
    if (!book) {
      res.status(404).json({ error: "Book not found" });
      return;
    }

    if (!user.favorites) {
      user.favorites = [];
    }

    const bookIndex = user.favorites.indexOf(id);
    if (bookIndex > -1) {
      user.favorites.splice(bookIndex, 1);
    } else {
      user.favorites.push(id);
    }

    await user.save();

    const updatedBook: IBook | null = await Book.findById(id);
    if (!updatedBook) {
      res.status(404).json({ error: "Book not found" });
      return;
    }

    const isFavorite = user.favorites.includes(id);
    res.json({ ...updatedBook.toObject(), isFavorite });
  } catch (error) {
    console.error("Error toggling favorite:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createReview = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user?._id;
    const username = req.user?.username;
      console.log(userId);
    if (!userId || !username) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    // Validate the book ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: "Invalid book ID" });
      return;
    }

    // Validate the rating
    if (!rating || typeof rating !== "number" || rating < 1 || rating > 5) {
      res.status(400).json({ error: "Invalid rating" });
      return;
    }

    const book: IBook | null = await Book.findById(id);
    if (!book) {
      res.status(404).json({ error: "Book not found" });
      return;
    }

    const newReview: IReview = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      userId,
      username,
      rating,
      comment,
    };

    book.reviews?.push(newReview);
    book.averageRating =
      book.reviews?.reduce((sum, review) => sum + review.rating, 0) /
      (book.reviews?.length || 1);

    await book.save();

    res.status(201).json(newReview);
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateReview = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { id, reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    // Validate the book ID and review ID
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(reviewId)) {
      res.status(400).json({ error: "Invalid book ID or review ID" });
      return;
    }

    // Validate the rating
    if (rating && (typeof rating !== "number" || rating < 1 || rating > 5)) {
      res.status(400).json({ error: "Invalid rating" });
      return;
    }

    const book: IBook | null = await Book.findById(id);
    if (!book) {
      res.status(404).json({ error: "Book not found" });
      return;
    }

    const reviewIndex = book.reviews?.findIndex(
      (review) => review._id?.toString() === reviewId
    );
    if (reviewIndex === undefined || reviewIndex === -1) {
      res.status(404).json({ error: "Review not found" });
      return;
    }

    if (book.reviews?.[reviewIndex].userId.toString() !== userId.toString()) {
      res.status(403).json({ error: "Not authorized to update this review" });
      return;
    }

    if (rating) {
      book.reviews[reviewIndex].rating = rating;
    }
    if (comment) {
      book.reviews[reviewIndex].comment = comment;
    }
    book.averageRating =
      book.reviews?.reduce((sum, review) => sum + review.rating, 0) /
      (book.reviews?.length || 1);

    await book.save();

    res.json(book.reviews[reviewIndex]);
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteReview = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { id, reviewId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    // Validate the book ID and review ID
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(reviewId)) {
      res.status(400).json({ error: "Invalid book ID or review ID" });
      return;
    }

    const book: IBook | null = await Book.findById(id);
    if (!book) {
      res.status(404).json({ error: "Book not found" });
      return;
    }

    const reviewIndex = book.reviews?.findIndex(
      (review) => review._id?.toString() === reviewId
    );
    if (reviewIndex === undefined || reviewIndex === -1) {
      res.status(404).json({ error: "Review not found" });
      return;
    }

    if (book.reviews?.[reviewIndex].userId.toString() !== userId.toString()) {
      res.status(403).json({ error: "Not authorized to delete this review" });
      return;
    }

    book.reviews?.splice(reviewIndex, 1);
    book.averageRating =
      book.reviews?.length > 0
        ? book.reviews.reduce((sum, review) => sum + review.rating, 0) /
          book.reviews.length
        : 0;

    await book.save();

    res.sendStatus(204);
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};