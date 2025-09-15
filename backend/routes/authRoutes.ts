import express from 'express';
import passport from 'passport';
import {
  register,
  login,
  googleCallback,
  getCurrentUser,
  logout, 
  updateProfile
} from '../controllers/authController';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

// Email/password auth
router.post('/register', register);
router.post('/login', login);

// Google OAuth
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  googleCallback
);

// Protected routes
router.get('/me', authenticate, getCurrentUser);
router.post('/logout', authenticate, logout);
router.put('/profile', authenticate, updateProfile);

export default router;