import express from 'express';
import {
  getAllMenus,
  getMenuById,
  createMenu,
  getMenusByParent,
} from '../controllers/menuController';
import { authenticate, requireAdmin } from '../middlewares/auth';

const router = express.Router();

// Public routes - get menus
router.get('/', getAllMenus);
router.get('/parent/:parentId', getMenusByParent);
router.get('/:id', getMenuById);

// Admin only routes - manage menus
router.post('/', authenticate, requireAdmin, createMenu);

export default router;
