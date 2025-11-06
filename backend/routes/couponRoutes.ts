import express from 'express';
import { getCoupons, getCoupon, createCoupon, updateCoupon, deleteCoupon, validateCoupon, applyCoupon } from '../controllers/couponController';

const router = express.Router();

// Specific routes must come BEFORE parameterized routes
router.post('/validate', validateCoupon);
router.post('/apply', applyCoupon);

// General CRUD routes
router.get('/', getCoupons);
router.post('/', createCoupon);
router.get('/:id', getCoupon);
router.put('/:id', updateCoupon);
router.delete('/:id', deleteCoupon);

export default router;
