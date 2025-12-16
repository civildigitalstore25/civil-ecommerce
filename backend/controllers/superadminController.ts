// Create a new admin (superadmin only)
export const createAdmin = async (req: Request, res: Response) => {
  const { email, password, fullName, phoneNumber } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      password: hashedPassword,
      fullName,
      phoneNumber,
      role: 'admin',
    });
    await user.save();
    res.status(201).json({ success: true, message: 'Admin created successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create admin', error: err });
  }
};
import { Request, Response } from 'express';
import User from '../models/User';

// Get all admins (not superadmin)
export const getAdmins = async (req: Request, res: Response) => {
  try {
    const admins = await User.find({ role: 'admin' });
    res.json({ success: true, admins });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch admins', error: err });
  }
};

// Delete an admin by ID (superadmin only)
export const deleteAdmin = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (user.role !== 'admin') {
      return res.status(400).json({ success: false, message: 'Can only delete admin users' });
    }
    await user.deleteOne();
    res.json({ success: true, message: 'Admin deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete admin', error: err });
  }
};
