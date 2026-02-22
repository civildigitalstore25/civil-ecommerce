import express from 'express';
import { getActiveDeals, checkProductDeal } from '../controllers/dealsController';

const router = express.Router();

// Get all active deals
router.get('/active', getActiveDeals);

// Check if a specific product has an active deal
router.get('/check/:productId', checkProductDeal);

export default router;
