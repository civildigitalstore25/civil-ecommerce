import { Router } from 'express';
import {
  createOrder,
  verifyPayment,
  paymentFailed,
  getOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  initiateRefund,
  deleteOrder,
  adminDeleteOrder,
  adminCreateOrder,
  handleWebhook
} from '../controllers/paymentController';
import { authenticate, requireAdmin } from '../middlewares/auth';

const router = Router();

// Webhook route (no authentication required - Cashfree will call this)
router.post('/webhook', handleWebhook);

// User routes (require authentication)
router.post('/create-order', authenticate, createOrder);
router.post('/verify', authenticate, verifyPayment);
router.post('/failed', authenticate, paymentFailed);
router.get('/orders', authenticate, getUserOrders);
router.get('/orders/:orderId', authenticate, getOrder);
router.delete('/orders/:orderId', authenticate, deleteOrder);

// Admin routes
router.post('/admin/orders', authenticate, requireAdmin, adminCreateOrder);
router.get('/admin/orders', authenticate, requireAdmin, getAllOrders);
router.put('/admin/orders/:orderId/status', authenticate, requireAdmin, updateOrderStatus);
router.delete('/admin/orders/:orderId', authenticate, requireAdmin, adminDeleteOrder);
router.post('/refund/:orderId', authenticate, requireAdmin, initiateRefund);

export default router;