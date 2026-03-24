import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getAdminCarts,
} from '../controllers/cartController';
import { authenticate, requirePermission } from '../middlewares/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get('/', getCart);
router.get('/admin/carts', requirePermission('carts'), getAdminCarts);
router.post('/add', addToCart);
router.put('/item/:itemId', updateCartItem);
router.delete('/item/:itemId', removeFromCart);
router.delete('/clear', clearCart);

export default router;