import { Request, Response } from 'express';
import Order from '../models/Order';
import razorpayService from '../services/razorpayService';
import * as phonepeService from '../services/phonepeService';
import emailService from '../services/emailService';
import mongoose from 'mongoose';

/**
 * Generate unique order ID
 */
const generateOrderId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `ORD-${timestamp}-${randomStr}`.toUpperCase();
};

/**
 * Get next order number (auto-increment) with retry logic
 */
const getNextOrderNumber = async (retries = 5): Promise<number> => {
  for (let attempt = 0; attempt < retries; attempt++) {
    const lastOrder = await Order.findOne({ orderNumber: { $exists: true, $ne: null } })
      .sort({ orderNumber: -1 })
      .select('orderNumber')
      .lean();

    const nextNumber = lastOrder && lastOrder.orderNumber ? lastOrder.orderNumber + 1 : 1001;

    // Check if this number is already taken (race condition check)
    const exists = await Order.findOne({ orderNumber: nextNumber });
    if (!exists) {
      return nextNumber;
    }

    // If exists, wait a bit and retry
    await new Promise(resolve => setTimeout(resolve, 50 * (attempt + 1)));
  }

  // Fallback: generate a random high number to avoid collision
  return 1001 + Math.floor(Math.random() * 1000000);
};

/**
 * Admin Create Order (Admin only - no payment gateway)
 */
export const adminCreateOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;

    if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
      res.status(403).json({
        success: false,
        message: 'Admin or Superadmin access required'
      });
      return;
    }

    const {
      email,
      items,
      subtotal,
      discount = 0,
      totalAmount,
      notes
    } = req.body;

    console.log('📝 Admin creating order:', { email, items, subtotal, discount, totalAmount });

    // Validation
    if (!items || items.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Order items are required'
      });
      return;
    }

    // If all productIds are valid ObjectIds, fetch driveLinks; otherwise, skip driveLink logic
    let itemsWithDriveLink = items;
    const allProductIdsAreObjectIds = items.every((item: any) => mongoose.Types.ObjectId.isValid(item.productId));
    if (allProductIdsAreObjectIds) {
      const Product = (await import('../models/Product')).default;
      const productIds = items.map((item: any) => item.productId);
      console.log('🔍 Admin order - Fetching products for IDs:', productIds);
      const products = await Product.find({ _id: { $in: productIds } }).select('_id driveLink name').lean();
      console.log('📦 Products found with driveLinks:', products.map(p => ({ 
        id: p._id, 
        name: (p as any).name, 
        driveLink: p.driveLink ? 'present' : 'missing' 
      })));
      // Create a map for quick lookup
      const productMap = new Map(products.map(p => [p._id.toString(), p.driveLink]));
      // Add driveLink to each item
      itemsWithDriveLink = items.map((item: any) => {
        const driveLink = productMap.get(item.productId) || null;
        console.log(`📎 Adding driveLink to order item: ${item.name} - ${driveLink ? 'has driveLink' : 'NO driveLink'}`);
        return {
          ...item,
          driveLink
        };
      });
    } else {
      // Arbitrary product IDs: just pass through, no driveLink
      itemsWithDriveLink = items;
    }

    // Generate order ID
    const orderId = generateOrderId();

    // Get next order number
    const orderNumber = await getNextOrderNumber();

    // Create order in database (no Razorpay, admin-created)
    const order = new Order({
      orderId,
      orderNumber,
      items: itemsWithDriveLink,
      subtotal,
      discount,
      shippingCharges: 0, // No shipping for digital products
      totalAmount,
      shippingAddress: {
        fullName: email || 'Admin Created',
        phoneNumber: 'N/A',
        addressLine1: 'N/A',
        city: 'N/A',
        state: 'N/A',
        pincode: '000000',
        country: 'N/A'
      },
      notes: notes || 'Order created by admin',
      paymentStatus: 'paid', // Admin orders are marked as paid
      orderStatus: 'processing'
    });

    await order.save();

    console.log('✅ Admin order created:', orderId, 'for email:', email);

    res.status(201).json({
      success: true,
      message: 'Order created successfully by admin',
      data: {
        orderId: order.orderId,
        orderNumber: order.orderNumber,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus
      }
    });
  } catch (error: any) {
    console.error('❌ Admin create order error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

/**
 * Create order and initiate Razorpay payment
 */
export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }
    const {
      items,
      subtotal,
      discount = 0,
      shippingCharges = 0,
      totalAmount,
      shippingAddress,
      couponCode,
      notes,
      gateway = 'razorpay',
      callbackUrl
    } = req.body;
    // Validation
    if (!items || items.length === 0) {
      res.status(400).json({ success: false, message: 'Cart is empty' });
      return;
    }
    // For digital products, shipping address is not required
    // If you want to enforce for physical products, add logic here
    // Fetch products to get driveLinks
    const Product = (await import('../models/Product')).default;
    const productIds = items.map((item: any) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } }).select('_id driveLink name').lean();
    const productMap = new Map(products.map(p => [p._id.toString(), p.driveLink]));
    const itemsWithDriveLink = items.map((item: any) => {
      const driveLink = productMap.get(item.productId) || null;
      return { ...item, driveLink };
    });
    // Generate order ID
    const orderId = generateOrderId();
    // Get next order number
    const orderNumber = await getNextOrderNumber();
    // Payment gateway selection
    if (gateway === 'phonepe') {
      if (!callbackUrl) {
        res.status(400).json({ success: false, message: 'callbackUrl required for PhonePe' });
        return;
      }
      const phonepeResult = await phonepeService.createPhonePePayment(
        orderId, 
        totalAmount, 
        callbackUrl,
        shippingAddress?.phoneNumber
      );
      
      const order = new Order({
        userId: user._id,
        orderId,
        orderNumber,
        items: itemsWithDriveLink,
        subtotal,
        discount,
        shippingCharges,
        totalAmount,
        shippingAddress,
        couponCode: couponCode ? couponCode.toUpperCase() : null,
        notes,
        phonepeTransactionId: phonepeResult.merchantTransactionId,
        paymentGateway: 'phonepe',
        paymentStatus: 'pending',
        orderStatus: 'pending'
      });
      await order.save();
      
      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: {
          orderId: order.orderId,
          paymentUrl: phonepeResult.paymentUrl,
          merchantTransactionId: phonepeResult.merchantTransactionId,
          gateway: 'phonepe'
        }
      });
      return;
    } else {
      // Default: Razorpay
      const customerInfo = {
        name: shippingAddress?.fullName || user.fullName || user.name || '',
        email: user.email,
        phone: shippingAddress?.phoneNumber || user.phoneNumber || ''
      };
      const razorpayOrder = await razorpayService.createOrder(
        totalAmount,
        orderId,
        customerInfo
      );
      if (!razorpayOrder.success) {
        res.status(500).json({ success: false, message: razorpayOrder.message || 'Failed to create payment order' });
        return;
      }
      const order = new Order({
        userId: user._id,
        orderId,
        orderNumber,
        items: itemsWithDriveLink,
        subtotal,
        discount,
        shippingCharges,
        totalAmount,
        shippingAddress,
        couponCode: couponCode ? couponCode.toUpperCase() : null,
        notes,
        razorpayOrderId: razorpayOrder.orderId,
        paymentGateway: 'razorpay',
        paymentStatus: 'pending',
        orderStatus: 'pending'
      });
      await order.save();
      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: {
          orderId: order.orderId,
          razorpayOrderId: razorpayOrder.orderId,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          keyId: process.env.RAZORPAY_KEY_ID,
          gateway: 'razorpay'
        }
      });
      return;
    }
  } catch (error: any) {
    console.error('❌ Create order error:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
};

/**
 * Verify payment and update order
 */
export const verifyPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('🔔 Payment verification started');
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;
    console.log('📦 Razorpay Order ID:', razorpay_order_id);

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      res.status(400).json({
        success: false,
        message: 'Missing payment verification data'
      });
      return;
    }

    // Verify signature
    const isValid = razorpayService.verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      res.status(400).json({
        success: false,
        message: 'Payment verification failed. Invalid signature.'
      });
      return;
    }

    // Update order in database
    const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });

    if (!order) {
      console.log('❌ Order not found for Razorpay Order ID:', razorpay_order_id);
      res.status(404).json({
        success: false,
        message: 'Order not found'
      });
      return;
    }

    console.log('✅ Order found:', order.orderId);
    console.log('🎟️ Coupon code in order:', order.couponCode || 'None');

    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;
    order.paymentStatus = 'paid';
    order.orderStatus = 'processing';
    await order.save();
    console.log('✅ Order status updated to processing');

    // Apply coupon if used
    if (order.couponCode) {
      try {
        console.log(`🎫 Processing coupon: ${order.couponCode}`);
        const Coupon = (await import('../models/Coupon')).default;
        const coupon = await Coupon.findOne({ code: order.couponCode.toUpperCase() });

        if (!coupon) {
          console.log(`❌ Coupon not found: ${order.couponCode}`);
        } else if (coupon.status !== 'Active') {
          console.log(`⚠️ Coupon ${coupon.code} is already ${coupon.status}`);
        } else if (coupon.usedCount >= coupon.usageLimit) {
          console.log(`⚠️ Coupon ${coupon.code} has reached usage limit (${coupon.usedCount}/${coupon.usageLimit})`);
        } else {
          // Increment usage count
          coupon.usedCount += 1;
          console.log(`✅ Coupon ${coupon.code} usage incremented: ${coupon.usedCount}/${coupon.usageLimit}`);

          // Auto-deactivate if usage limit reached
          if (coupon.usedCount >= coupon.usageLimit) {
            coupon.status = 'Inactive';
            console.log(`🚫 Coupon ${coupon.code} auto-deactivated - limit reached!`);
          }

          await coupon.save();
          console.log(`💾 Coupon ${coupon.code} saved successfully`);
        }
      } catch (couponError) {
        console.error('❌ Error applying coupon:', couponError);
        // Don't fail the payment if coupon update fails
      }
    } else {
      console.log('ℹ️ No coupon code in order');
    }

    console.log('✅ Payment verified for order:', order.orderId);

    // Send order confirmation notifications
    try {
      console.log('📧 Preparing to send notifications...');

      // Populate order with product details for better email/WhatsApp content
      await order.populate('userId', 'name email');

      const orderDetails = {
        orderId: order.orderId,
        orderNumber: order.orderNumber,
        customerName: order.shippingAddress.fullName,
        customerPhone: order.shippingAddress.phoneNumber,
        customerEmail: (order as any).userId?.email || order.notes?.replace('Email: ', '') || 'N/A',
        items: order.items.map((item: any) => {
          console.log('📦 Order Item from DB:', {
            name: item.name,
            version: item.version,
            pricingPlan: item.pricingPlan,
            fullItem: item
          });

          return {
            productId: item.productId || null,
            name: item.name,
            version: item.version || null,
            pricingPlan: item.pricingPlan || null,
            quantity: item.quantity,
            price: item.price
          };
        }),
        subtotal: order.subtotal,
        discount: order.discount,
        totalAmount: order.totalAmount,
        paymentId: razorpay_payment_id
      };

      console.log('📧 Sending email to:', process.env.CONTACT_EMAIL);

      // Send email notification to admin
      try {
        await emailService.sendOrderConfirmationToAdmin(orderDetails);
        console.log('✅ Admin email notification sent successfully');
      } catch (emailError: any) {
        console.error('❌ Failed to send admin email:', emailError.message);
      }

    } catch (notificationError: any) {
      console.error('❌ Error sending notifications:', notificationError.message);
      // Don't fail the payment verification if notifications fail
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        orderId: order.orderId,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus
      }
    });
  } catch (error: any) {
    console.error('❌ Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

/**
 * Handle payment failure
 */
export const paymentFailed = async (req: Request, res: Response): Promise<void> => {
  try {
    const { razorpay_order_id, error } = req.body;

    if (!razorpay_order_id) {
      res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
      return;
    }

    const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });

    if (order) {
      order.paymentStatus = 'failed';
      order.notes = `${order.notes || ''}\nPayment failed: ${error?.description || 'Unknown error'}`;
      await order.save();

      console.log('❌ Payment failed for order:', order.orderId);
    }

    res.status(200).json({
      success: true,
      message: 'Payment failure recorded'
    });
  } catch (error: any) {
    console.error('❌ Payment failed handler error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

/**
 * Get order details
 */
export const getOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { orderId } = req.params;

    const order = await Order.findOne({ orderId });

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Order not found'
      });
      return;
    }

    // Check if user owns this order (unless admin)
    if (user.role !== 'admin' && order.userId && order.userId.toString() !== user._id.toString()) {
      res.status(403).json({
        success: false,
        message: 'Access denied'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error: any) {
    console.error('❌ Get order error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

/**
 * Get all orders for a user
 */
export const getUserOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { page = 1, limit = 100, status } = req.query;

    console.log('🔍 Fetching orders for user:', user._id);

    const query: any = { userId: user._id };

    if (status) {
      query.orderStatus = status;
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .lean();

    const total = await Order.countDocuments(query);

    // Populate driveLinks for orders that don't have them
    const Product = (await import('../models/Product')).default;
    const ordersWithDriveLinks = await Promise.all(
      orders.map(async (order) => {
        const itemsWithDriveLinks = await Promise.all(
          order.items.map(async (item: any) => {
            console.log(`🔍 Checking item: ${item.name}, productId: ${item.productId}, existing driveLink: ${item.driveLink}`);
            
            // If item already has driveLink, keep it
            if (item.driveLink) {
              console.log(`✓ Item already has driveLink: ${item.driveLink}`);
              return item;
            }
            
            // Otherwise, fetch from Product
            const product = await Product.findById(item.productId).select('driveLink').lean();
            console.log(`📦 Fetched product: ${product?._id}, driveLink: ${product?.driveLink || 'NONE'}`);
            
            return {
              ...item,
              driveLink: product?.driveLink || null
            };
          })
        );
        return {
          ...order,
          items: itemsWithDriveLinks
        };
      })
    );

    console.log(`📦 Found ${ordersWithDriveLinks.length} orders for user ${user._id}`);
    console.log('First order items:', ordersWithDriveLinks[0]?.items?.map((i: any) => ({ 
      name: i.name, 
      driveLink: i.driveLink ? 'present' : 'missing',
      fullDriveLink: i.driveLink
    })));

    res.status(200).json({
      success: true,
      data: ordersWithDriveLinks,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalOrders: total
      }
    });
  } catch (error: any) {
    console.error('❌ Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

/**
 * Get all orders (Admin only)
 */
export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, status, paymentStatus } = req.query;

    const query: any = {};

    if (status) {
      query.orderStatus = status;
    }

    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    const orders = await Order.find(query)
      .populate('userId', 'fullName email phoneNumber')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(total / Number(limit)),
          totalOrders: total
        }
      }
    });
  } catch (error: any) {
    console.error('❌ Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

/**
 * Update order status (Admin only)
 */
export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body;

    console.log('🔧 Backend - Update order status request received');
    console.log('🔧 orderId from params:', orderId);
    console.log('🔧 orderStatus from body:', orderStatus);
    console.log('🔧 Full body:', req.body);

    // Validate status
    const validStatuses = ['processing', 'delivered', 'cancelled'];
    if (!orderStatus || !validStatuses.includes(orderStatus)) {
      console.log('❌ Backend - Invalid status:', orderStatus);
      res.status(400).json({
        success: false,
        message: `Invalid order status. Must be one of: ${validStatuses.join(', ')}`
      });
      return;
    }

    console.log('🔧 Backend - Looking for order with orderId:', orderId);

    // Try to find by orderId first, then by _id as fallback
    let order = await Order.findOne({ orderId });

    if (!order) {
      console.log('🔧 Backend - Not found by orderId, trying _id...');
      order = await Order.findById(orderId);
    }

    if (!order) {
      console.log('❌ Backend - Order not found by orderId or _id:', orderId);
      res.status(404).json({
        success: false,
        message: 'Order not found'
      });
      return;
    }

    console.log('✅ Backend - Order found:', order.orderId || order._id);

    order.orderStatus = orderStatus;
    await order.save();

    console.log(`✅ Order ${orderId} status updated to: ${orderStatus}`);

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error: any) {
    console.error('❌ Backend - Update order status error:', error);
    console.error('❌ Backend - Error message:', error.message);
    console.error('❌ Backend - Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

/**
 * Initiate refund (Admin only)
 */
export const initiateRefund = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId } = req.params;
    const { amount } = req.body;

    const order = await Order.findOne({ orderId });

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Order not found'
      });
      return;
    }

    if (order.paymentStatus !== 'paid') {
      res.status(400).json({
        success: false,
        message: 'Cannot refund unpaid order'
      });
      return;
    }

    if (!order.razorpayPaymentId) {
      res.status(400).json({
        success: false,
        message: 'Payment ID not found'
      });
      return;
    }

    const refundResult = await razorpayService.initiateRefund(
      order.razorpayPaymentId,
      amount || order.totalAmount
    );

    if (!refundResult.success) {
      res.status(500).json({
        success: false,
        message: refundResult.message || 'Failed to initiate refund'
      });
      return;
    }

    order.paymentStatus = 'refunded';
    order.orderStatus = 'cancelled';
    await order.save();

    console.log('✅ Refund initiated for order:', order.orderId);

    res.status(200).json({
      success: true,
      message: 'Refund initiated successfully',
      data: refundResult.refund
    });
  } catch (error: any) {
    console.error('❌ Initiate refund error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

/**
 * Delete order (only for pending/failed orders)
 */
export const deleteOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { orderId } = req.params;

    const order = await Order.findOne({ orderId, userId: user._id });

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Order not found'
      });
      return;
    }

    // Only allow deletion of pending or failed orders
    if (order.paymentStatus === 'paid' || order.orderStatus === 'processing' || order.orderStatus === 'shipped' || order.orderStatus === 'delivered') {
      res.status(400).json({
        success: false,
        message: 'Cannot delete orders that are paid or being processed'
      });
      return;
    }

    await Order.deleteOne({ _id: order._id });

    console.log('🗑️ Order deleted:', order.orderId);

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error: any) {
    console.error('❌ Delete order error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

/**
 * Delete order (Admin only - can delete any order)
 */
export const adminDeleteOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId } = req.params;

    console.log('🗑️ Admin delete order request for:', orderId);

    // Try to find by orderId first, then by _id as fallback
    let order = await Order.findOne({ orderId });

    if (!order) {
      console.log('🔧 Not found by orderId, trying _id...');
      order = await Order.findById(orderId);
    }

    if (!order) {
      console.log('❌ Order not found:', orderId);
      res.status(404).json({
        success: false,
        message: 'Order not found'
      });
      return;
    }

    await Order.deleteOne({ _id: order._id });

    console.log('✅ Admin deleted order:', order.orderId || orderId);

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error: any) {
    console.error('❌ Admin delete order error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

/**
 * Verify PhonePe Payment
 */
export const verifyPhonePePayment = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('📱 PhonePe payment verification started');
    const { merchantTransactionId } = req.body;

    if (!merchantTransactionId) {
      res.status(400).json({
        success: false,
        message: 'merchantTransactionId is required'
      });
      return;
    }

    // Verify payment with PhonePe
    const verificationResult = await phonepeService.verifyPhonePePayment(merchantTransactionId);

    // Find order by PhonePe transaction ID
    const order = await Order.findOne({ phonepeTransactionId: merchantTransactionId });

    if (!order) {
      console.log('❌ Order not found for PhonePe transaction:', merchantTransactionId);
      res.status(404).json({
        success: false,
        message: 'Order not found'
      });
      return;
    }

    console.log('✅ Order found:', order.orderId);

    // Check payment status
    if (verificationResult.success && verificationResult.code === 'PAYMENT_SUCCESS') {
      order.phonepePaymentId = verificationResult.data?.transactionId || merchantTransactionId;
      order.paymentStatus = 'paid';
      order.orderStatus = 'processing';
      await order.save();

      console.log('✅ PhonePe payment verified for order:', order.orderId);

      // Apply coupon if used
      if (order.couponCode) {
        try {
          console.log(`🎫 Processing coupon: ${order.couponCode}`);
          const Coupon = (await import('../models/Coupon')).default;
          const coupon = await Coupon.findOne({ code: order.couponCode.toUpperCase() });

          if (coupon && coupon.status === 'Active' && coupon.usedCount < coupon.usageLimit) {
            coupon.usedCount += 1;
            console.log(`✅ Coupon ${coupon.code} usage incremented: ${coupon.usedCount}/${coupon.usageLimit}`);

            if (coupon.usedCount >= coupon.usageLimit) {
              coupon.status = 'Inactive';
              console.log(`🚫 Coupon ${coupon.code} auto-deactivated - limit reached!`);
            }

            await coupon.save();
          }
        } catch (couponError) {
          console.error('❌ Error applying coupon:', couponError);
        }
      }

      // Send notifications
      try {
        await order.populate('userId', 'name email');
        
        const orderDetails = {
          orderId: order.orderId,
          orderNumber: order.orderNumber,
          customerName: order.shippingAddress.fullName,
          customerPhone: order.shippingAddress.phoneNumber,
          customerEmail: (order as any).userId?.email || 'N/A',
          items: order.items.map((item: any) => ({
            productId: item.productId || null,
            name: item.name,
            version: item.version || null,
            pricingPlan: item.pricingPlan || null,
            quantity: item.quantity,
            price: item.price
          })),
          subtotal: order.subtotal,
          discount: order.discount,
          totalAmount: order.totalAmount,
          paymentId: merchantTransactionId
        };

        const emailService = (await import('../services/emailService')).default;
        await emailService.sendOrderConfirmationToAdmin(orderDetails);
        console.log('✅ Admin email notification sent successfully');
      } catch (notificationError: any) {
        console.error('❌ Error sending notifications:', notificationError.message);
      }

      res.status(200).json({
        success: true,
        message: 'PhonePe payment verified successfully',
        data: {
          orderId: order.orderId,
          orderStatus: order.orderStatus,
          paymentStatus: order.paymentStatus
        }
      });
    } else {
      order.paymentStatus = 'failed';
      order.notes = `${order.notes || ''}\nPhonePe payment failed: ${verificationResult.message}`;
      await order.save();

      res.status(400).json({
        success: false,
        message: 'PhonePe payment verification failed',
        data: verificationResult
      });
    }
  } catch (error: any) {
    console.error('❌ PhonePe verify payment error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

/**
 * PhonePe Callback Handler
 */
export const handlePhonePeCallback = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('📞 PhonePe callback received');
    const callbackData = req.body;

    const result = await phonepeService.handlePhonePeCallback(callbackData);
    
    if (result.success) {
      const merchantTransactionId = result.data?.merchantTransactionId;
      
      if (merchantTransactionId) {
        const order = await Order.findOne({ phonepeTransactionId: merchantTransactionId });
        
        if (order) {
          order.phonepePaymentId = result.data?.transactionId || merchantTransactionId;
          order.paymentStatus = 'paid';
          order.orderStatus = 'processing';
          await order.save();
        }
      }
    }

    res.status(200).json({
      success: true,
      message: 'Callback processed'
    });
  } catch (error: any) {
    console.error('❌ PhonePe callback error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Callback processing failed'
    });
  }
};
