import { Router } from 'express';
import { submitContactForm, getContactSubmissions } from '../controllers/contactController';
import { authenticate } from '../middlewares/auth';

const router = Router();

// Public route for submitting contact form
router.post('/submit', submitContactForm);

// Protected route for admin to view submissions
router.get('/submissions', authenticate, getContactSubmissions);

export default router;