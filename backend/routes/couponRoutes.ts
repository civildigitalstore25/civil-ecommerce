import express from 'express';
import { getCoupons, getCoupon, createCoupon, updateCoupon, deleteCoupon } from '../controllers/couponController';

const router = express.Router();
router.get('/', getCoupons);
router.get('/:id', getCoupon);
router.post('/', createCoupon);
router.put('/:id', updateCoupon);
router.delete('/:id', deleteCoupon);

export default router;
