import { Request, Response } from 'express';
import Product from '../models/Product';

// Get all active deals
export const getActiveDeals = async (req: Request, res: Response) => {
  try {
    const currentDate = new Date();
    
    // Find products where:
    // 1. isDeal is true
    // 2. Current date is between dealStartDate and dealEndDate
    // 3. Status is active (not draft or inactive)
    const deals = await Product.find({
      isDeal: true,
      dealStartDate: { $lte: currentDate },
      dealEndDate: { $gte: currentDate },
      status: 'active'
    }).sort({ dealEndDate: 1 }); // Sort by ending soon

    res.json({
      success: true,
      deals,
      count: deals.length
    });
  } catch (error: any) {
    console.error('Error fetching active deals:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch active deals',
      error: error.message
    });
  }
};

// Check if a specific product has an active deal
export const checkProductDeal = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const currentDate = new Date();
    
    const product = await Product.findOne({
      _id: productId,
      isDeal: true,
      dealStartDate: { $lte: currentDate },
      dealEndDate: { $gte: currentDate },
      status: 'active'
    });

    if (!product) {
      return res.json({
        success: true,
        hasDeal: false
      });
    }

    res.json({
      success: true,
      hasDeal: true,
      product
    });
  } catch (error: any) {
    console.error('Error checking product deal:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check product deal',
      error: error.message
    });
  }
};
