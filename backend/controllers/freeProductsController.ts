import { Request, Response } from 'express';
import Product from '../models/Product';

/**
 * Get all active free products (within their time window, active, not out of stock).
 * List prices may stay non-zero in DB; storefront shows ₹0 during the window via flags/dates.
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
    }).sort({ freeProductEndDate: 1 }).lean();

    res.json({ success: true, products, count: products.length });
  } catch (error: any) {
    console.error('Error fetching active free products:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
