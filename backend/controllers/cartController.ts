import { Request, Response } from 'express';
import Cart from '../models/Cart';
import Product from '../models/Product';
import { Types } from 'mongoose';

// Helper function to calculate item total price
const calculateItemTotal = (price: number, quantity: number): number => {
  return Math.round(price * quantity * 100) / 100;
};

// Helper function to get price by license type
const getPriceByLicenseType = (product: any, licenseType: string): number => {
  switch (licenseType) {
    case '1year': return product.price1 || 0;
    case '3year': return product.price3 || 0;
    case 'lifetime': return product.priceLifetime || 0;
    default: return product.price1 || 0;
  }
};

export const getCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user._id;
    
    const cart = await Cart.findOne({ user: userId })
      .populate('items.product', 'name description image company category version')
      .exec();

    if (!cart) {
      // Create empty cart if it doesn't exist
      const newCart = new Cart({ user: userId, items: [] });
      await newCart.save();
      res.json(newCart);
      return;
    }

    res.json(cart);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const addToCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user._id;
    const { productId, licenseType, quantity = 1 } = req.body;

    // Validate input
    if (!productId || !licenseType) {
      res.status(400).json({ message: 'Product ID and license type are required' });
      return;
    }

    // Get product
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    const price = getPriceByLicenseType(product, licenseType);
    if (price <= 0) {
      res.status(400).json({ message: 'Invalid price for selected license' });
      return;
    }

    const totalPrice = calculateItemTotal(price, quantity);

    // Find or create cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Check if item already exists
    const existingItemIndex = cart.items.findIndex(
      (item: any) => 
        item.product.toString() === productId && 
        item.licenseType === licenseType
    );

    if (existingItemIndex >= 0) {
      // Update existing item
      const existingItem = cart.items[existingItemIndex];
      existingItem.quantity += quantity;
      existingItem.totalPrice = calculateItemTotal(price, existingItem.quantity);
    } else {
      // Add new item - explicitly cast product._id to Types.ObjectId
      const newItem = {
        product: product._id as Types.ObjectId,
        licenseType,
        quantity,
        price,
        totalPrice
      };
      cart.items.push(newItem as any);
    }

    await cart.save();
    await cart.populate('items.product', 'name description image company category version');

    res.json(cart);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCartItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user._id;
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      res.status(400).json({ message: 'Valid quantity is required' });
      return;
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      res.status(404).json({ message: 'Cart not found' });
      return;
    }

    // Find item by _id using find instead of .id() method
    const item = cart.items.find((item: any) => item._id?.toString() === itemId);
    if (!item) {
      res.status(404).json({ message: 'Item not found in cart' });
      return;
    }

    item.quantity = quantity;
    item.totalPrice = calculateItemTotal(item.price, quantity);

    await cart.save();
    await cart.populate('items.product', 'name description image company category version');

    res.json(cart);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFromCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user._id;
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      res.status(404).json({ message: 'Cart not found' });
      return;
    }

    // Filter out the item to remove instead of using .pull()
    cart.items = cart.items.filter((item: any) => item._id?.toString() !== itemId);
    
    await cart.save();
    await cart.populate('items.product', 'name description image company category version');

    res.json(cart);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const clearCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user._id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      res.status(404).json({ message: 'Cart not found' });
      return;
    }

    cart.items = [];
    await cart.save();

    res.json(cart);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};