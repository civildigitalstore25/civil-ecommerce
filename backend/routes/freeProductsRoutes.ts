import { Router } from 'express';
import { getActiveFreeProducts } from '../controllers/freeProductsController';

const router = Router();
router.get('/active', getActiveFreeProducts);

export default router;
