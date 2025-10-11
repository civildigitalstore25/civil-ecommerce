import express from 'express';
import {
  createOrder,
  handleCallback,
  checkStatus,
  getUserOrders,
  getOrderDetails,
  initiateRefund
} from '../controllers/paymentController';
import { authenticate} from '../middlewares/auth';

const router = express.Router();

// Protected routes (require authentication)
router.post('/create-order', authenticate, createOrder);
router.get('/status/:merchantTransactionId', authenticate, checkStatus);
router.get('/orders', authenticate, getUserOrders);
router.get('/orders/:orderId', authenticate, getOrderDetails);
router.post('/refund/:orderId', authenticate, initiateRefund);

// Public route (for PhonePe callback)
router.post('/callback', handleCallback);

export default router;