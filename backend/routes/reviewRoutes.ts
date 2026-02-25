import express from 'express';
import {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  getAllReviews,
  getProductReviewStats,
  addReplyToReview,
  updateReply,
  deleteReply,
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

// Reply routes (require authentication)
router.post('/:reviewId/reply', authenticate, addReplyToReview);
router.put('/:reviewId/reply/:replyId', authenticate, updateReply);
router.delete('/:reviewId/reply/:replyId', authenticate, deleteReply);

// Admin routes
router.get('/admin/all', authenticate, getAllReviews);

export default router;