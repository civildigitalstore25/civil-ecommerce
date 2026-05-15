import express from 'express';
import {
  getExpiredProducts,
  getExpiringProducts,
  getExpiryStats,
  debugOrderExpiry,
} from '../controllers/expiryController';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

/**
 * All expiry routes require authentication
 */
router.use(authenticate);

/**
 * GET /api/expiry/expired
 * Get list of expired product licenses
 * Query: search, page, pageSize
 */
router.get('/expired', getExpiredProducts);

/**
 * GET /api/expiry/expiring
 * Get list of product licenses expiring soon (within X days)
 * Query: daysUntil (default 30), page, pageSize, search
 */
router.get('/expiring', getExpiringProducts);

/**
 * GET /api/expiry/stats
 * Get summary statistics about expired/expiring licenses
 */
router.get('/stats', getExpiryStats);

/**
 * GET /api/expiry/debug/:orderId
 * Debug endpoint to check why an order isn't showing in expired/expiring sections
 */
router.get('/debug/:orderId', debugOrderExpiry);

export default router;
