import { Request, Response } from 'express';
import Order from '../models/Order';
import razorpayService from '../services/razorpayService';
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
 * Create order and initiate Razorpay payment
 */
export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
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
      notes
    } = req.body;

    // Validation
    if (!items || items.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
      return;
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phoneNumber) {
      res.status(400).json({
        success: false,
        message: 'Shipping address is required'
      });
      return;
    }

    // Generate order ID
    const orderId = generateOrderId();

    // Get next order number
    const orderNumber = await getNextOrderNumber();

    // Create Razorpay order
    const customerInfo = {
      name: shippingAddress.fullName,
      email: user.email,
      phone: shippingAddress.phoneNumber
    };

    const razorpayOrder = await razorpayService.createOrder(
      totalAmount,
      orderId,
      customerInfo
    );

    if (!razorpayOrder.success) {
      res.status(500).json({
        success: false,
        message: razorpayOrder.message || 'Failed to create payment order'
      });
      return;
    }

    // Create order in database
    const order = new Order({
      userId: user._id,
      orderId,
      orderNumber,
      items,
      subtotal,
      discount,
      shippingCharges,
      totalAmount,
      shippingAddress,
      couponCode: couponCode ? couponCode.toUpperCase() : null,
      notes,
      razorpayOrderId: razorpayOrder.orderId,
      paymentStatus: 'pending',
      orderStatus: 'pending'
    });

    await order.save();

    console.log('✅ Order created:', orderId, 'for userId:', user._id, couponCode ? `with coupon: ${couponCode.toUpperCase()}` : '');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        orderId: order.orderId,
        razorpayOrderId: razorpayOrder.orderId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        keyId: process.env.RAZORPAY_KEY_ID
      }
    });
  } catch (error: any) {
    console.error(' Create order error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
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
    console.error(' Verify payment error:', error);
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

      console.log(' Payment failed for order:', order.orderId);
    }

    res.status(200).json({
      success: true,
      message: 'Payment failure recorded'
    });
  } catch (error: any) {
    console.error(' Payment failed handler error:', error);
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
    if (user.role !== 'admin' && order.userId.toString() !== user._id.toString()) {
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
    console.error(' Get order error:', error);
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

    console.log(`📦 Found ${orders.length} orders for user ${user._id}`);
    console.log('Orders:', orders.map(o => ({ orderId: o.orderId, orderNumber: o.orderNumber, userId: o.userId })));

    res.status(200).json({
      success: true,
      data: orders,
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
    console.error(' Get all orders error:', error);
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

    console.log(' Refund initiated for order:', order.orderId);

    res.status(200).json({
      success: true,
      message: 'Refund initiated successfully',
      data: refundResult.refund
    });
  } catch (error: any) {
    console.error(' Initiate refund error:', error);
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