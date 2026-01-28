import { Request, Response } from 'express';
import Lead from '../models/Lead';
import Coupon from '../models/Coupon';
import User from '../models/User';
import emailService from '../services/emailService';

// Generate random coupon code
const generateCouponCode = (): string => {
  const prefix = 'WELCOME';
  const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}${randomString}`;
};

// Create welcome lead and generate discount code
export const createWelcomeLead = async (req: Request, res: Response) => {
  try {
    const { name, email, whatsappNumber } = req.body;

    // Validate required fields
    if (!name || !email || !whatsappNumber) {
      return res.status(400).json({ 
        error: 'All fields are required' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Invalid email format' 
      });
    }

    // Check if email is already registered as a user
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ 
        error: 'This email is already registered. Please login to your account to access exclusive offers.',
        isRegistered: true
      });
    }

    // Check if lead with this email already exists
    const existingLead = await Lead.findOne({ email: email.toLowerCase() });
    if (existingLead) {
      return res.status(400).json({ 
        error: 'You have already claimed your welcome discount code. Check your email for the code.',
        discountCode: existingLead.discountCode,
        alreadyClaimed: true
      });
    }

    // Generate unique coupon code
    let discountCode: string;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    while (!isUnique && attempts < maxAttempts) {
      discountCode = generateCouponCode();
      const existingCode = await Coupon.findOne({ code: discountCode });
      if (!existingCode) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      return res.status(500).json({ 
        error: 'Failed to generate unique coupon code. Please try again.' 
      });
    }

    // Create the coupon in database
    const validFrom = new Date();
    const validTo = new Date();
    validTo.setDate(validTo.getDate() + 30); // Valid for 30 days

    const newCoupon = new Coupon({
      code: discountCode!,
      name: `Welcome Discount - ${name}`,
      description: `Special welcome discount for ${email}`,
      discountType: 'Percentage',
      discountValue: 10, // 10% discount
      validFrom,
      validTo,
      usageLimit: 1, // Can only be used once
      usedCount: 0,
      status: 'Active'
    });

    await newCoupon.save();

    // Create lead record
    const newLead = new Lead({
      name,
      email: email.toLowerCase(),
      whatsappNumber,
      discountCode: discountCode!,
      couponUsed: false
    });

    await newLead.save();

    // Send email with discount code
    try {
      await emailService.sendWelcomeDiscountEmail(
        email,
        name,
        discountCode!,
        newCoupon.discountValue,
        validTo
      );
      console.log(`✅ Welcome email sent to ${email}`);
    } catch (emailError) {
      console.error('❌ Failed to send welcome email:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Welcome! Your discount code has been generated.',
      data: {
        name,
        email,
        discountCode: discountCode!,
        discountValue: newCoupon.discountValue,
        discountType: newCoupon.discountType,
        validUntil: validTo
      }
    });

  } catch (error) {
    console.error('Error creating welcome lead:', error);
    res.status(500).json({ 
      error: 'Failed to process your request. Please try again.' 
    });
  }
};

// Get lead by email (optional - for admin purposes)
export const getLeadByEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    
    const lead = await Lead.findOne({ email: email.toLowerCase() });
    
    if (!lead) {
      return res.status(404).json({ 
        error: 'Lead not found' 
      });
    }

    res.json({
      success: true,
      data: lead
    });

  } catch (error) {
    console.error('Error fetching lead:', error);
    res.status(500).json({ 
      error: 'Failed to fetch lead data' 
    });
  }
};

// Get all leads (admin only)
export const getAllLeads = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    const leads = await Lead.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Lead.countDocuments();

    res.json({
      success: true,
      data: leads,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ 
      error: 'Failed to fetch leads' 
    });
  }
};
