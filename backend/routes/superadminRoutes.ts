
import express from 'express';
import { authenticate, requireSuperadmin } from '../middlewares/auth';
import { getAdmins, deleteAdmin, createAdmin, updateAdminPermissions } from '../controllers/superadminController';

const router = express.Router();

// Create a new admin
router.post('/admins', authenticate, requireSuperadmin, createAdmin);

// Example: Superadmin-only route
router.get('/dashboard', authenticate, requireSuperadmin, (req, res) => {
  res.json({ success: true, message: 'Superadmin dashboard access granted.' });
});

// List all admins
router.get('/admins', authenticate, requireSuperadmin, getAdmins);

// Update admin permissions (support PUT and PATCH)
router.patch('/admins/:id/permissions', authenticate, requireSuperadmin, updateAdminPermissions);
router.put('/admins/:id/permissions', authenticate, requireSuperadmin, updateAdminPermissions);

// Delete an admin by ID
router.delete('/admins/:id', authenticate, requireSuperadmin, deleteAdmin);

export default router;
