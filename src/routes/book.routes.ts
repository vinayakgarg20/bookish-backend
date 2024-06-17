import express from 'express';
import {
  getBooks,
  getBookById,
  toggleFavorite,
  createReview,
  updateReview,
  deleteReview,
  createBooks,
} from '../controllers/book.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/',authenticate, getBooks);
router.get('/:id',authenticate, getBookById);
router.post('/create', authenticate, createBooks);
router.post('/:id/toggle-favorite', authenticate, toggleFavorite);
router.post('/:id/add-review', authenticate, createReview);
router.put('/:id/reviews/:reviewId', authenticate, updateReview);
router.delete('/:id/reviews/:reviewId', authenticate, deleteReview);

export default router;