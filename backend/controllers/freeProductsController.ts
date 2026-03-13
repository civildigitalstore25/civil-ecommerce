import { Request, Response } from 'express';
import Product from '../models/Product';

/**
 * Get all active free products (within their time window, price 0, active, not out of stock).
 * Used by homepage "Free for limited time" section.
 */
export const getActiveFreeProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const now = new Date();
    const products = await Product.find({
      isFreeProduct: true,
      freeProductStartDate: { $lte: now },
      freeProductEndDate: { $gte: now },
      status: 'active',
      isOutOfStock: { $ne: true },
      $or: [
        { price1INR: 0 },
        { price1: 0 },
        { price1INR: { $exists: false }, price1: 0 }
      ]
    }).sort({ freeProductEndDate: 1 }).lean();

    res.json({ success: true, products, count: products.length });
  } catch (error: any) {
    console.error('Error fetching active free products:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
