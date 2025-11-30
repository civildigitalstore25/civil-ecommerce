import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User, { IUser } from '../models/User';
import emailService from '../services/emailService';
import mongoose from 'mongoose';

const JWT_SECRET: jwt.Secret = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';

const generateToken = (userId: string): string => {
  return jwt.sign(
    { userId },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES } as jwt.SignOptions
  );
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, fullName, phoneNumber, role } = req.body;

    // Validate phone number presence
    if (!phoneNumber) {
      res.status(400).json({ message: 'Phone number is required' });
      return;
    }

    // Basic phone number format validation (allows +, digits, spaces, dashes)
    const phoneRegex = /^[+\d][0-9\s-\-]{6,20}$/;
    if (!phoneRegex.test(String(phoneNumber))) {
      res.status(400).json({ message: 'Invalid phone number format' });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({
      email,
      password: hashedPassword,
      fullName,
      phoneNumber,
      role: role === 'admin' ? 'admin' : 'user' // Allow admin role for testing
    });

    const savedUser = await user.save();
    const userId = (savedUser._id as mongoose.Types.ObjectId).toString();
    const token = generateToken(userId);

    res.status(201).json({
      token,
      user: {
        id: userId,
        email: savedUser.email,
        fullName: savedUser.fullName,
        phoneNumber: savedUser.phoneNumber,
        role: savedUser.role
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    if (!user.password) {
      res.status(401).json({ message: 'Please use Google login' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const userId = (user._id as mongoose.Types.ObjectId).toString();
    const token = generateToken(userId);

    res.json({
      token,
      user: {
        id: userId,
        email: user.email,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        role: user.role
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const googleCallback = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user as IUser;

    if (!user) {
      res.status(401).json({ message: 'Authentication failed' });
      return;
    }

    const userId = (user._id as mongoose.Types.ObjectId).toString();
    const token = generateToken(userId);
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user as IUser;
    if (!user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }
    console.log('👤 Current user ID:', user._id);
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json({ message: 'Logged out successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user as IUser;
    const userId = user._id;
    const { fullName, phoneNumber } = req.body;

    // Input validation
    if (!fullName && !phoneNumber) {
      res.status(400).json({ message: 'No fields to update' });
      return;
    }

    const updateData: any = {};
    if (fullName !== undefined) updateData.fullName = fullName;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const updatedUserId = (updatedUser._id as mongoose.Types.ObjectId).toString();

    res.json({
      id: updatedUserId,
      email: updatedUser.email,
      fullName: updatedUser.fullName,
      phoneNumber: updatedUser.phoneNumber,
      role: updatedUser.role
    });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

// Forgot Password
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: 'Email is required' });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Don't reveal if user exists or not for security
      res.status(200).json({
        message: 'If an account with that email exists, we have sent a password reset link.'
      });
      return;
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save reset token to user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    // Send email
    try {
      await emailService.sendPasswordResetEmail(user.email, resetToken);
      res.status(200).json({
        message: 'Password reset email sent successfully'
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Clear the reset token if email fails
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      res.status(500).json({
        message: 'Failed to send password reset email'
      });
    }
  } catch (error: any) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Validate Reset Token
export const validateResetToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.params;

    if (!token) {
      res.status(400).json({ message: 'Token is required' });
      return;
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
      res.status(400).json({ message: 'Invalid or expired reset token' });
      return;
    }

    res.status(200).json({ message: 'Token is valid' });
  } catch (error: any) {
    console.error('Validate reset token error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Reset Password
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.params;
    const { password, email } = req.body;

    if (!token || !password) {
      res.status(400).json({ message: 'Token and password are required' });
      return;
    }

    // Validate password
    if (password.length < 8) {
      res.status(400).json({ message: 'Password must be at least 8 characters long' });
      return;
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
      res.status(400).json({ message: 'Invalid or expired reset token' });
      return;
    }

    // Optional: Verify email matches (additional security)
    if (email && user.email.toLowerCase() !== email.toLowerCase()) {
      res.status(400).json({ message: 'Email does not match the account associated with this token' });
      return;
    }

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update password and clear reset token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Send confirmation email
    try {
      await emailService.sendPasswordChangeConfirmation(user.email);
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the password reset if email fails
    }

    res.status(200).json({
      message: 'Password reset successfully',
      success: true
    });
  } catch (error: any) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};