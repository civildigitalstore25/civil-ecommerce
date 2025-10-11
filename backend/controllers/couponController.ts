import { Request, Response } from 'express';
import Coupon from '../models/Coupon';

export const getCoupons = async (req: Request, res: Response) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) {
    console.error('Error fetching coupons:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getCoupon = async (req: Request, res: Response) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    res.json(coupon);
  } catch (err) {
    console.error('Error fetching coupon:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const createCoupon = async (req: Request, res: Response) => {
  try {
    const existingCoupon = await Coupon.findOne({ code: req.body.code });
    if (existingCoupon) return res.status(400).json({ message: 'Coupon code already exists' });

    // Ensure date string is converted to Date object
    req.body.validFrom = new Date(req.body.validFrom);
    req.body.validTo = new Date(req.body.validTo);

    const coupon = new Coupon(req.body);
    await coupon.save();
    res.status(201).json(coupon);
  } catch (err: any) {
    console.error('Error creating coupon:', err);
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }
    res.status(400).json({ message: err.message || 'Failed to create coupon' });
  }
};

export const updateCoupon = async (req: Request, res: Response) => {
  try {
    if (req.body.code) {
      const existingCoupon = await Coupon.findOne({ code: req.body.code, _id: { $ne: req.params.id } });
      if (existingCoupon) return res.status(400).json({ message: 'Coupon code already exists' });
    }

    // Ensure date string is converted to Date object
    if (req.body.validFrom) req.body.validFrom = new Date(req.body.validFrom);
    if (req.body.validTo) req.body.validTo = new Date(req.body.validTo);

    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    res.json(coupon);
  } catch (err: any) {
    console.error('Error updating coupon:', err);
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }
    res.status(400).json({ message: err.message || 'Failed to update coupon' });
  }
};

export const deleteCoupon = async (req: Request, res: Response) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    res.json({ message: 'Coupon deleted successfully' });
  } catch (err) {
    console.error('Error deleting coupon:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};
