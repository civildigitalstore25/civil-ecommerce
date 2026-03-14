import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Coupon from '../models/Coupon';

export const getCoupons = async (req: Request, res: Response) => {
  try {
    const coupons = await Coupon.find()
      .sort({ createdAt: -1 })
      .populate('applicableProductIds', 'name');
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

    // Convert applicableProductIds (string[]) to ObjectIds if provided
    if (req.body.applicableProductIds && Array.isArray(req.body.applicableProductIds)) {
      req.body.applicableProductIds = req.body.applicableProductIds
        .filter((id: string) => mongoose.Types.ObjectId.isValid(id))
        .map((id: string) => new mongoose.Types.ObjectId(id));
    } else {
      req.body.applicableProductIds = [];
    }

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

    // Convert applicableProductIds (string[]) to ObjectIds if provided
    if (req.body.applicableProductIds !== undefined) {
      if (Array.isArray(req.body.applicableProductIds)) {
        req.body.applicableProductIds = req.body.applicableProductIds
          .filter((id: string) => mongoose.Types.ObjectId.isValid(id))
          .map((id: string) => new mongoose.Types.ObjectId(id));
      } else {
        req.body.applicableProductIds = [];
      }
    }

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

// Validate and apply coupon
export const validateCoupon = async (req: Request, res: Response) => {
  try {
    const { code, subtotal, productIds = [], items = [] } = req.body;

    if (!code || subtotal === undefined) {
      return res.status(400).json({ message: 'Coupon code and subtotal are required' });
    }

    const coupon = await Coupon.findOne({ code: (code as string).toUpperCase() });

    if (!coupon) {
      return res.status(404).json({ message: 'Invalid coupon code' });
    }

    if (coupon.status !== 'Active') {
      return res.status(400).json({ message: 'This coupon is no longer active' });
    }

    const now = new Date();
    if (now < coupon.validFrom) {
      return res.status(400).json({ message: 'This coupon is not yet valid' });
    }
    if (now > coupon.validTo) {
      return res.status(400).json({ message: 'This coupon has expired' });
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ message: 'Coupon validity expired - usage limit reached' });
    }

    const applicableIds = (coupon.applicableProductIds || []).map((id: mongoose.Types.ObjectId) => id.toString());
    const isProductSpecific = applicableIds.length > 0;

    let eligibleSubtotal = Number(subtotal);
    let discountAmount = 0;

    if (isProductSpecific) {
      const cartProductIds = Array.isArray(productIds) ? productIds.map((id: string) => String(id)) : [];
      const cartItems = Array.isArray(items) ? items : [];
      if (cartProductIds.length === 0 && cartItems.length === 0) {
        return res.status(400).json({
          message: 'This coupon is valid only for specific products. Add the applicable product(s) to your cart.',
        });
      }

      const hasMatchingProduct = cartProductIds.some((id: string) =>
        applicableIds.some((aid: string) => aid === id || aid === String(id))
      );
      if (!hasMatchingProduct) {
        return res.status(400).json({ message: 'This coupon is not valid for the products in your cart.' });
      }

      if (cartItems.length > 0) {
        eligibleSubtotal = 0;
        for (const item of cartItems) {
          const pid = item.productId ? String(item.productId) : null;
          if (pid && applicableIds.some((aid: string) => aid === pid)) {
            eligibleSubtotal += Number(item.subtotal) || 0;
          }
        }
      } else {
        eligibleSubtotal = Number(subtotal);
      }

      if (coupon.discountType === 'Percentage') {
        discountAmount = (eligibleSubtotal * coupon.discountValue) / 100;
      } else {
        discountAmount = coupon.discountValue;
      }
      discountAmount = Math.min(discountAmount, eligibleSubtotal);
    } else {
      if (coupon.discountType === 'Percentage') {
        discountAmount = (Number(subtotal) * coupon.discountValue) / 100;
      } else {
        discountAmount = coupon.discountValue;
      }
      discountAmount = Math.min(discountAmount, Number(subtotal));
    }

    const response: any = {
      success: true,
      coupon: {
        code: coupon.code,
        name: coupon.name,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
        remainingUses: coupon.usageLimit - coupon.usedCount,
      },
    };
    if (isProductSpecific) {
      response.coupon.eligibleSubtotal = eligibleSubtotal;
      response.coupon.applicableToProductIds = applicableIds;
    }

    res.json(response);
  } catch (err) {
    console.error('Error validating coupon:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Apply coupon (increment usage count)
export const applyCoupon = async (req: Request, res: Response) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: 'Coupon code is required' });
    }

    // Find coupon by code (case-insensitive)
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return res.status(404).json({ message: 'Invalid coupon code' });
    }

    // Check usage limit
    if (coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ message: 'Coupon validity expired - usage limit reached' });
    }

    // Increment usage count
    coupon.usedCount += 1;

    // Auto-deactivate if usage limit reached
    if (coupon.usedCount >= coupon.usageLimit) {
      coupon.status = 'Inactive';
    }

    await coupon.save();

    res.json({
      success: true,
      message: 'Coupon applied successfully',
      coupon: {
        code: coupon.code,
        usedCount: coupon.usedCount,
        usageLimit: coupon.usageLimit,
        status: coupon.status,
      }
    });
  } catch (err) {
    console.error('Error applying coupon:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};
