import { Router } from 'express';
import {
  createOrder,
  verifyPayment,
  paymentFailed,
  getOrder,
  getUserOrders,
  getAllOrders,
  initiateRefund,
  deleteOrder
} from '../controllers/paymentController';
import { authenticate, requireAdmin } from '../middlewares/auth';

const router = Router();

// User routes (require authentication)
router.post('/create-order', authenticate, createOrder);
router.post('/verify', authenticate, verifyPayment);
router.post('/failed', authenticate, paymentFailed);
router.get('/orders', authenticate, getUserOrders);
router.get('/orders/:orderId', authenticate, getOrder);
router.delete('/orders/:orderId', authenticate, deleteOrder);

// Admin routes
router.get('/admin/orders', authenticate, requireAdmin, getAllOrders);
router.post('/refund/:orderId', authenticate, requireAdmin, initiateRefund);

export default router;