import express from 'express';
import {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  getAllReviews,
  getProductReviewStats,
} from '../controllers/reviewController';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

// Public routes
router.get('/product/:productId', getProductReviews);
router.get('/product/:productId/stats', getProductReviewStats);

// Protected routes (require authentication)
router.post('/product/:productId', authenticate, createReview);
router.put('/:reviewId', authenticate, updateReview);
router.delete('/:reviewId', authenticate, deleteReview);

// Admin routes
router.get('/admin/all', authenticate, getAllReviews);

export default router;