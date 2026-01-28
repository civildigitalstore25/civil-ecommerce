import express from 'express';
import {
  getAllMenus,
  getMenuById,
  createMenu,
  updateMenu,
  deleteMenu,
  reorderMenus,
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
router.put('/:id', authenticate, requireAdmin, updateMenu);
router.delete('/:id', authenticate, requireAdmin, deleteMenu);
router.patch('/reorder', authenticate, requireAdmin, reorderMenus);

export default router;
