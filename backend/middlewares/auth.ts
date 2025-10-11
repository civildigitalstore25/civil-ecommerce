import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({ 
        success: false,
        message: 'No token provided. Authentication required.' 
      });
      return;
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    
    if (!decoded.userId) {
      res.status(401).json({ 
        success: false,
        message: 'Invalid token format' 
      });
      return;
    }

    // Find user
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      res.status(401).json({ 
        success: false,
        message: 'User not found. Token invalid.' 
      });
      return;
    }

    // Attach user to request object
    (req as any).user = user;
    next();
  } catch (error: any) {
    console.error('Authentication error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      res.status(401).json({ 
        success: false,
        message: 'Invalid token' 
      });
    } else if (error.name === 'TokenExpiredError') {
      res.status(401).json({ 
        success: false,
        message: 'Token expired' 
      });
    } else {
      res.status(401).json({ 
        success: false,
        message: 'Authentication failed' 
      });
    }
  }
};

/**
 * Admin authorization middleware
 * Must be used after authenticate middleware
 */
export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const user = (req as any).user as IUser;
  
  if (!user) {
    res.status(401).json({ 
      success: false,
      message: 'Authentication required' 
    });
    return;
  }

  if (user.role !== 'admin') {
    res.status(403).json({ 
      success: false,
      message: 'Admin access required. Insufficient permissions.' 
    });
    return;
  }
  
  next();
};

/**
 * Optional authentication middleware
 * Attaches user if token is valid, but doesn't fail if no token
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      next();
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await User.findById(decoded.userId).select('-password');

    if (user) {
      (req as any).user = user;
    }

    next();
  } catch (error) {
    // Silently continue without user
    next();
  }
};