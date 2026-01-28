import express from 'express';
import {
    createWelcomeLead,
    getLeadByEmail,
    getAllLeads
} from '../controllers/leadController';
import { authenticate, requireAdmin } from '../middlewares/auth';

const router = express.Router();

// Public route - create welcome lead
router.post('/welcome', createWelcomeLead);

// Protected routes - admin only
router.get('/email/:email', authenticate, requireAdmin, getLeadByEmail);
router.get('/', authenticate, requireAdmin, getAllLeads);

export default router;
