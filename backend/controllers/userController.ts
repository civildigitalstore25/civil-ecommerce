import { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import bcrypt from 'bcryptjs';
import { resolveOptionalPagination } from '../utils/listPagination';

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search = '', role = '' } = req.query;
    const { paginate, page, limit, skip } = resolveOptionalPagination(req.query);

    const query: any = {};

    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { fullName: { $regex: search, $options: 'i' } }
      ];
    }

    if (role) {
      query.role = role;
    }

    let userQuery = User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });

    if (paginate) {
      userQuery = userQuery.skip(skip).limit(limit);
    }

    const users = await userQuery;
    const total = await User.countDocuments(query);

    res.json({
      users,
      totalPages: paginate ? Math.ceil(total / limit) : 1,
      currentPage: paginate ? page : 1,
      total
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, fullName, phoneNumber, role = 'user', password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User with this email already exists' });
      return;
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = new User({
      email,
      fullName,
      phoneNumber,
      role,
      password: hashedPassword,
      isActive: true
    });

    await user.save();

    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { role, isActive } = req.body;

    const updateData: any = {};
    if (role !== undefined) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(updatedUser);
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};