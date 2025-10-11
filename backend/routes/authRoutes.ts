import { Router } from 'express';
import passport from 'passport';
import { 
  register, 
  login, 
  googleCallback, 
  getCurrentUser, 
  logout, 
  updateProfile,
  forgotPassword,
  validateResetToken,
  resetPassword
} from '../controllers/authController';
import { authenticate } from '../middlewares/auth';

const router = Router();

// Basic auth routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Password reset routes
router.post('/forgot-password', forgotPassword);
router.get('/validate-reset-token/:token', validateResetToken);
router.post('/reset-password/:token', resetPassword);

// Protected routes
router.get('/me', authenticate, getCurrentUser);
router.put('/profile', authenticate, updateProfile);

// Google OAuth routes
router.get('/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback', 
  passport.authenticate('google', { session: false }),
  googleCallback
);

export default router;