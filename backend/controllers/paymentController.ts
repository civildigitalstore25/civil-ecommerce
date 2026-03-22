import { Request, Response } from 'express';
import Order, { coerceLegacyOrderStatus } from '../models/Order';
import cashfreeService from '../services/cashfreeService';
import emailService from '../services/emailService';
import mongoose from 'mongoose';
import { getDownloadEligibility } from '../utils/downloadEligibility';
import { postPaymentOrderStatusForOrderItems } from '../utils/orderEbookStatus';

/**
 * Generate short, human-readable order ID.
 * Format: XXX-1234 where XXX comes from product name (if available).
 */
const generateOrderId = (productName?: string): string => {
  // Derive a 3-letter code from product name, fallback to ORD
  const base = (productName || "ORD")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .slice(0, 3);
  const code = (base || "ORD").padEnd(3, "X");

  // Short random suffix to keep IDs unique
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();

  return `${code}-${randomStr}`;
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

const emailFromOrderNotes = (notes: string | undefined | null): string => {
  if (!notes || typeof notes !== 'string') return '';
  const m = notes.match(/^Email:\s*(.+)$/im);
  return m ? m[1].trim() : '';
};

const exportCustomerPhone = (order: { shippingAddress?: { phoneNumber?: string }; userId?: { phoneNumber?: string } | null }): string =>
  order.shippingAddress?.phoneNumber || (order.userId as { phoneNumber?: string } | undefined)?.phoneNumber || '';

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
    let adminPostPayStatus: 'delivered' | 'processing' = 'processing';
    const allProductIdsAreObjectIds = items.every((item: any) => mongoose.Types.ObjectId.isValid(item.productId));
    if (allProductIdsAreObjectIds) {
      const Product = (await import('../models/Product')).default;
      const productIds = items.map((item: any) => item.productId);
      console.log('🔍 Admin order - Fetching products for IDs:', productIds);
      const products = await Product.find({ _id: { $in: productIds } }).select('_id driveLink name company brand').lean();
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
      const productBrandMapAdmin = new Map(
        products.map((p) => [p._id.toString(), { company: (p as any).company, brand: (p as any).brand }]),
      );
      adminPostPayStatus = postPaymentOrderStatusForOrderItems(itemsWithDriveLink, productBrandMapAdmin);
    } else {
      // Arbitrary product IDs: just pass through, no driveLink
      itemsWithDriveLink = items;
    }

    // Generate order ID (based on first product name if available)
    const firstItemName = Array.isArray(itemsWithDriveLink) && itemsWithDriveLink.length > 0
      ? itemsWithDriveLink[0].name
      : undefined;
    const orderId = generateOrderId(firstItemName);

    // Get next order number
    const orderNumber = await getNextOrderNumber();

    // Create order in database (admin-created)
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
      orderStatus: adminPostPayStatus
    });

    await order.save();

    console.log('✅ Admin order created:', orderId, 'for email:', email);

    // Send purchase confirmation email to customer if email provided
    if (email && email !== 'Admin Created' && email.includes('@')) {
      try {
        const customerOrderDetails = {
          orderId: order.orderId,
          orderNumber: order.orderNumber,
          customerName: email.split('@')[0], // Use part before @ as name if no proper name
          customerEmail: email,
          items: itemsWithDriveLink.map((item: any) => ({
            productId: item.productId || null,
            name: item.name,
            version: item.version || null,
            pricingPlan: item.pricingPlan || null,
            quantity: item.quantity,
            price: item.price,
            driveLink: item.driveLink || null
          })),
          subtotal,
          discount,
          totalAmount,
          purchaseDate: order.createdAt || new Date(),
          downloadLinks: itemsWithDriveLink.map((item: any) => ({
            name: item.name,
            driveLink: item.driveLink
          }))
        };
        
        await emailService.sendPurchaseConfirmationEmail(customerOrderDetails);
        console.log('✅ Admin-created order: Customer purchase confirmation email sent to:', email);
      } catch (emailError: any) {
        console.error('❌ Failed to send customer confirmation email for admin order:', emailError.message);
      }
    } else {
      console.log('ℹ️ Invalid or missing email for admin order, skipping customer confirmation');
    }

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
 * Create order and initiate Cashfree payment
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

    // Fetch products to get driveLinks
    const Product = (await import('../models/Product')).default;
    const productIds = items.map((item: any) => item.productId);
    console.log('🔍 Creating order - Fetching products for IDs:', productIds);
    const products = await Product.find({ _id: { $in: productIds } }).select('_id driveLink name company brand').lean();
    console.log('📦 Products found with driveLinks:', products.map(p => ({
      id: p._id,
      name: (p as any).name,
      driveLink: p.driveLink ? 'present' : 'missing'
    })));

    // Create a map for quick lookup
    const productMap = new Map(products.map(p => [p._id.toString(), p.driveLink]));
    const productBrandMap = new Map(
      products.map((p) => [p._id.toString(), { company: (p as any).company, brand: (p as any).brand }]),
    );

    // Add driveLink to each item
    const itemsWithDriveLink = items.map((item: any) => {
      const driveLink = productMap.get(item.productId) || null;
      console.log(`📎 Adding driveLink to order item: ${item.name} - ${driveLink ? 'has driveLink' : 'NO driveLink'}`);
      return {
        ...item,
        driveLink
      };
    });

    // Generate order ID (based on first product name if available)
    const firstItemName = Array.isArray(itemsWithDriveLink) && itemsWithDriveLink.length > 0
      ? itemsWithDriveLink[0].name
      : undefined;
    const orderId = generateOrderId(firstItemName);

    // Get next order number
    const orderNumber = await getNextOrderNumber();

    const totalNum = Number(totalAmount) || 0;
    const isFreeOrder = totalNum <= 0;

    // For free orders (₹0), skip payment gateway and create order as paid
    if (isFreeOrder) {
      const couponCodeUpper = couponCode ? String(couponCode).toUpperCase() : null;
      const freeOrderStatus = postPaymentOrderStatusForOrderItems(itemsWithDriveLink, productBrandMap);
      const order = new Order({
        userId: user._id,
        orderId,
        orderNumber,
        items: itemsWithDriveLink,
        subtotal,
        discount,
        shippingCharges,
        totalAmount: totalNum,
        shippingAddress,
        couponCode: couponCodeUpper,
        notes,
        cashfreeOrderId: undefined,
        paymentSessionId: undefined,
        paymentStatus: 'paid',
        orderStatus: freeOrderStatus
      });

      await order.save();

      // Apply coupon if used
      if (couponCodeUpper) {
        try {
          const Coupon = (await import('../models/Coupon')).default;
          const coupon = await Coupon.findOne({ code: couponCodeUpper });
          if (coupon && coupon.status === 'Active' && coupon.usedCount < coupon.usageLimit) {
            coupon.usedCount += 1;
            if (coupon.usedCount >= coupon.usageLimit) coupon.status = 'Inactive';
            await coupon.save();
          }
        } catch (e) {
          console.error('Free order coupon update failed:', e);
        }
      }

      // Send order confirmation emails
      try {
        const customerEmail = user.email || (notes?.replace?.(/^Email:\s*/i, '').trim()) || 'N/A';
        const orderDetails = {
          orderId: order.orderId,
          orderNumber: order.orderNumber,
          customerName: shippingAddress.fullName,
          customerPhone: shippingAddress.phoneNumber,
          customerEmail,
          items: itemsWithDriveLink.map((item: any) => ({
            productId: item.productId || null,
            name: item.name,
            version: item.version || null,
            pricingPlan: item.pricingPlan || null,
            quantity: item.quantity,
            price: item.price
          })),
          subtotal,
          discount,
          totalAmount: totalNum,
          paymentId: 'FREE_ORDER'
        };
        await emailService.sendOrderConfirmationToAdmin(orderDetails);
        if (customerEmail && customerEmail !== 'N/A' && customerEmail.includes('@')) {
          await emailService.sendPurchaseConfirmationEmail({
            ...orderDetails,
            purchaseDate: order.createdAt || new Date(),
            downloadLinks: itemsWithDriveLink.map((item: any) => ({ name: item.name, driveLink: item.driveLink }))
          });
        }
        order.adminNotificationSent = true;
        await order.save();
      } catch (e) {
        console.error('Free order email failed:', e);
      }

      console.log('✅ Free order created (no payment):', orderId, 'for userId:', user._id);

      res.status(201).json({
        success: true,
        message: 'Order placed successfully',
        data: {
          orderId: order.orderId,
          isFreeOrder: true,
          amount: 0,
          currency: 'INR'
        }
      });
      return;
    }

    // Create Cashfree order for paid orders
    const customerInfo = {
      customerId: user._id.toString(),
      name: shippingAddress.fullName,
      email: user.email,
      phone: shippingAddress.phoneNumber
    };

    const cashfreeOrder = await cashfreeService.createOrder(
      totalAmount,
      orderId,
      customerInfo
    );

    if (!cashfreeOrder.success) {
      res.status(500).json({
        success: false,
        message: cashfreeOrder.message || 'Failed to create payment order'
      });
      return;
    }

    // Create order in database
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
      cashfreeOrderId: cashfreeOrder.orderId,
      paymentSessionId: cashfreeOrder.paymentSessionId,
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
        paymentSessionId: cashfreeOrder.paymentSessionId,
        amount: cashfreeOrder.amount,
        currency: cashfreeOrder.currency,
        environment: process.env.CASHFREE_ENV || 'sandbox'
      }
    });
  } catch (error: any) {
    console.error('❌ Create order error:', error);
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
      orderId
    } = req.body;
    console.log('📦 Order ID:', orderId);

    if (!orderId) {
      res.status(400).json({
        success: false,
        message: 'Missing order ID'
      });
      return;
    }

    // Fetch order details from Cashfree
    const cashfreeOrderDetails = await cashfreeService.getOrderDetails(orderId);

    if (!cashfreeOrderDetails.success) {
      res.status(400).json({
        success: false,
        message: 'Failed to verify payment with Cashfree'
      });
      return;
    }

    const orderStatus = cashfreeOrderDetails.order.order_status;
    console.log('📊 Cashfree Order Status:', orderStatus);

    // Check if payment is successful
    if (orderStatus !== 'PAID') {
      res.status(400).json({
        success: false,
        message: `Payment not completed. Status: ${orderStatus}`
      });
      return;
    }

    // Update order in database
    const order = await Order.findOne({ orderId });

    if (!order) {
      console.log('❌ Order not found for Order ID:', orderId);
      res.status(404).json({
        success: false,
        message: 'Order not found'
      });
      return;
    }

    console.log('✅ Order found:', order.orderId);
    console.log('🎟️ Coupon code in order:', order.couponCode || 'None');

    // Fetch payment details
    const paymentDetails = await cashfreeService.getPaymentDetails(orderId);
    const cfPaymentId = paymentDetails.success && paymentDetails.payments[0]
      ? paymentDetails.payments[0].cf_payment_id
      : null;

    order.cashfreePaymentId = cfPaymentId;
    order.paymentStatus = 'paid';
    const Product = (await import('../models/Product')).default;
    const paidItemIds = order.items.map((i) => i.productId).filter((id) => mongoose.Types.ObjectId.isValid(id));
    const paidProducts = await Product.find({ _id: { $in: paidItemIds } }).select('_id company brand').lean();
    const paidBrandMap = new Map(
      paidProducts.map((p) => [p._id.toString(), { company: (p as any).company, brand: (p as any).brand }]),
    );
    order.orderStatus = postPaymentOrderStatusForOrderItems(order.items, paidBrandMap);
    await order.save();
    console.log(`✅ Order status updated to ${order.orderStatus}`);

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

    // Send order confirmation notifications (only once - prevents duplicate emails from retries/StrictMode)
    if ((order as any).adminNotificationSent) {
      console.log('ℹ️ Admin notification already sent for this order, skipping');
      res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        data: {
          orderId: order.orderId,
          orderStatus: order.orderStatus,
          paymentStatus: order.paymentStatus
        }
      });
      return;
    }

    try {
      console.log('📧 Preparing to send notifications...');
      
      // Get the authenticated user's email (this is the logged-in user)
      const authenticatedUser = (req as any).user;
      let customerEmail = 'N/A';
      
      if (authenticatedUser && authenticatedUser.email) {
        customerEmail = authenticatedUser.email;
        console.log('✅ Using authenticated user email for confirmation:', customerEmail);
      } else {
        // Fallback: try to populate order with user details
        await order.populate('userId', 'name email');
        customerEmail = (order as any).userId?.email || order.notes?.replace('Email: ', '') || 'N/A';
        console.log('⚠️ Using fallback email method:', customerEmail);
      }

      const orderDetails = {
        orderId: order.orderId,
        orderNumber: order.orderNumber,
        customerName: order.shippingAddress.fullName,
        customerPhone: order.shippingAddress.phoneNumber,
        customerEmail: customerEmail,
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
        paymentId: cfPaymentId || 'N/A'
      };

      console.log('📧 Sending email to:', process.env.CONTACT_EMAIL);

      // Send email notification to admin
      try {
        await emailService.sendOrderConfirmationToAdmin(orderDetails);
        console.log('✅ Admin email notification sent successfully');
      } catch (emailError: any) {
        console.error('❌ Failed to send admin email:', emailError.message);
      }

        // Send purchase confirmation email to customer
        try {
          const customerOrderDetails = {
            ...orderDetails,
            purchaseDate: order.createdAt || new Date(),
            downloadLinks: order.items.map((item: any) => ({
              name: item.name,
              driveLink: item.driveLink
            }))
          };
          
          // Ensure we have a valid email before sending
          if (customerEmail && customerEmail !== 'N/A' && customerEmail.includes('@')) {
            await emailService.sendPurchaseConfirmationEmail(customerOrderDetails);
            console.log('✅ Customer purchase confirmation email sent to:', customerEmail);
          } else {
            console.log('❌ Invalid customer email, skipping confirmation email:', customerEmail);
          }
        } catch (emailError: any) {
          console.error('❌ Failed to send customer confirmation email:', emailError.message);
        }

        // Mark notifications as sent to prevent duplicates
        order.adminNotificationSent = true;
        await order.save();
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
    const { orderId, error } = req.body;

    if (!orderId) {
      res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
      return;
    }

    const order = await Order.findOne({ orderId });

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

    // Populate driveLinks and current download eligibility for order items
    const Product = (await import('../models/Product')).default;
    const ordersWithDriveLinks = await Promise.all(
      orders.map(async (order) => {
        const itemsWithDriveLinks = await Promise.all(
          order.items.map(async (item: any) => {
            console.log(`🔍 Checking item: ${item.name}, productId: ${item.productId}, existing driveLink: ${item.driveLink}`);

            // Fetch latest product state for drive-link and free-offer checks
            const product = await Product.findById(item.productId)
              .select('driveLink isFreeProduct freeProductStartDate freeProductEndDate')
              .lean();
            console.log(`📦 Fetched product: ${product?._id}, driveLink: ${product?.driveLink || 'NONE'}`);

            const effectiveOrderStatus = coerceLegacyOrderStatus(order.orderStatus);
            const eligibility = getDownloadEligibility({
              orderPaymentStatus: order.paymentStatus,
              orderStatus: effectiveOrderStatus,
              orderItemPrice: item.price,
              product,
            });

            return {
              ...item,
              driveLink: item.driveLink || product?.driveLink || null,
              canDownload: eligibility.canDownload,
              downloadBlockedReason: eligibility.reason || null,
              isFreeProduct: eligibility.isFreeProduct,
              isFreeOfferActive: eligibility.isFreeOfferActive,
            };
          })
        );
        return {
          ...order,
          orderStatus: coerceLegacyOrderStatus(order.orderStatus),
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

    if (!order.cashfreePaymentId) {
      res.status(400).json({
        success: false,
        message: 'Payment ID not found'
      });
      return;
    }

    // Generate unique refund ID
    const refundId = `REFUND-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`.toUpperCase();

    const refundResult = await cashfreeService.initiateRefund(
      order.orderId,
      order.cashfreePaymentId,
      amount || order.totalAmount,
      refundId
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
    const st = coerceLegacyOrderStatus(order.orderStatus);
    if (order.paymentStatus === 'paid' || st === 'processing' || st === 'delivered') {
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
 * Bulk update order statuses (Admin only)
 */
export const bulkUpdateOrderStatuses = async (req: Request, res: Response): Promise<void> => {
  try {
    const { updates } = req.body;

    if (!Array.isArray(updates) || updates.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Invalid updates array'
      });
      return;
    }

    // Validate all updates before processing
    const validStatuses = ['processing', 'delivered', 'cancelled'];
    for (const update of updates) {
      if (!update.orderId || !update.status) {
        res.status(400).json({
          success: false,
          message: 'Each update must have orderId and status'
        });
        return;
      }
      if (!validStatuses.includes(update.status)) {
        res.status(400).json({
          success: false,
          message: `Invalid status: ${update.status}. Must be one of: ${validStatuses.join(', ')}`
        });
        return;
      }
    }

    console.log(`📦 Bulk updating ${updates.length} orders...`);

    const results = [];
    let successCount = 0;
    let failureCount = 0;

    for (const update of updates) {
      try {
        // Try to find by orderId first, then by _id as fallback
        let order = await Order.findOne({ orderId: update.orderId });
        if (!order) {
          order = await Order.findById(update.orderId);
        }

        if (!order) {
          failureCount++;
          results.push({
            orderId: update.orderId,
            success: false,
            message: 'Order not found'
          });
          continue;
        }

        order.orderStatus = update.status;
        await order.save();
        successCount++;

        results.push({
          orderId: order.orderId || update.orderId,
          success: true,
          message: `Status updated to ${update.status}`
        });

        console.log(`✅ Updated order ${update.orderId} to ${update.status}`);
      } catch (error: any) {
        failureCount++;
        results.push({
          orderId: update.orderId,
          success: false,
          message: error.message
        });
        console.error(`❌ Failed to update order ${update.orderId}:`, error.message);
      }
    }

    res.status(200).json({
      success: true,
      message: `${successCount} orders updated successfully, ${failureCount} failed`,
      data: {
        successCount,
        failureCount,
        results
      }
    });
  } catch (error: any) {
    console.error('❌ Bulk update error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

/**
 * Export orders data (Admin only)
 */
export const exportOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const { format = 'json', status, paymentStatus } = req.query;

    const query: any = {};

    if (status) {
      query.orderStatus = status;
    }

    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    console.log(`📊 Exporting orders as ${format}...`);

    const orders = await Order.find(query)
      .populate('userId', 'fullName email phoneNumber')
      .sort({ createdAt: -1 })
      .lean();

    // Format order data for export
    const exportData = orders.map((order: any) => ({
      'Order ID': order.orderId,
      'Order Number': order.orderNumber,
      'Customer Name': order.shippingAddress?.fullName || order.userId?.fullName || 'N/A',
      'Customer Email': order.userId?.email || emailFromOrderNotes(order.notes) || 'N/A',
      'Customer Phone': exportCustomerPhone(order) || 'N/A',
      'Order Status': order.orderStatus,
      'Payment Status': order.paymentStatus,
      'Subtotal': order.subtotal,
      'Discount': order.discount || 0,
      'Shipping Charges': order.shippingCharges || 0,
      'Total Amount': order.totalAmount,
      'Items Count': order.items?.length || 0,
      'Created At': order.createdAt?.toISOString() || 'N/A',
      'Updated At': order.updatedAt?.toISOString() || 'N/A',
      'Notes': order.notes || ''
    }));

    if (format === 'excel') {
      // Return as JSON which will be converted to Excel on frontend
      res.status(200).json({
        success: true,
        data: exportData,
        format: 'excel'
      });
    } else {
      // Return as JSON
      res.status(200).json({
        success: true,
        data: exportData,
        format: 'json'
      });
    }
  } catch (error: any) {
    console.error('❌ Export orders error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

/**
 * Handle Cashfree webhook for payment notifications
 */
export const handleWebhook = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('📬 Cashfree webhook received');
    
    const signature = req.headers['x-webhook-signature'] as string;
    const timestamp = req.headers['x-webhook-timestamp'] as string;
    const rawBody = JSON.stringify(req.body);

    // Verify webhook signature
    const isValid = cashfreeService.verifyWebhookSignature(
      rawBody,
      signature,
      timestamp
    );

    if (!isValid) {
      console.error('❌ Invalid webhook signature');
      res.status(400).json({
        success: false,
        message: 'Invalid signature'
      });
      return;
    }

    const { type, data } = req.body;

    console.log(`📨 Webhook type: ${type}`);
    console.log(`📦 Webhook data:`, data);

    // Handle payment success webhook
    if (type === 'PAYMENT_SUCCESS_WEBHOOK') {
      const { order } = data;
      const orderId = order.order_id;

      // Find order in database
      const dbOrder = await Order.findOne({ orderId });

      if (!dbOrder) {
        console.error(`❌ Order not found: ${orderId}`);
        res.status(404).json({
          success: false,
          message: 'Order not found'
        });
        return;
      }

      // Update order status if not already updated
      if (dbOrder.paymentStatus !== 'paid') {
        // Get payment details from Cashfree
        const paymentDetails = await cashfreeService.getPaymentDetails(orderId);
        const cfPaymentId = paymentDetails.success && paymentDetails.payments[0]
          ? paymentDetails.payments[0].cf_payment_id
          : null;

        dbOrder.cashfreePaymentId = cfPaymentId;
        dbOrder.paymentStatus = 'paid';
        const Product = (await import('../models/Product')).default;
        const whIds = dbOrder.items.map((i) => i.productId).filter((id) => mongoose.Types.ObjectId.isValid(id));
        const whProducts = await Product.find({ _id: { $in: whIds } }).select('_id company brand').lean();
        const whBrandMap = new Map(
          whProducts.map((p) => [p._id.toString(), { company: (p as any).company, brand: (p as any).brand }]),
        );
        dbOrder.orderStatus = postPaymentOrderStatusForOrderItems(dbOrder.items, whBrandMap);
        await dbOrder.save();

        console.log(`✅ Order ${orderId} marked as paid via webhook (${dbOrder.orderStatus})`);

        // Apply coupon if used
        if (dbOrder.couponCode) {
          try {
            const Coupon = (await import('../models/Coupon')).default;
            const coupon = await Coupon.findOne({ code: dbOrder.couponCode.toUpperCase() });

            if (coupon && coupon.status === 'Active' && coupon.usedCount < coupon.usageLimit) {
              coupon.usedCount += 1;
              if (coupon.usedCount >= coupon.usageLimit) {
                coupon.status = 'Inactive';
              }
              await coupon.save();
              console.log(`✅ Coupon ${coupon.code} usage updated via webhook`);
            }
          } catch (couponError) {
            console.error('❌ Error applying coupon via webhook:', couponError);
          }
        }
      } else {
        console.log(`ℹ️ Order ${orderId} already marked as paid`);
      }
    }

    // Acknowledge webhook
    res.status(200).json({
      success: true,
      message: 'Webhook processed'
    });
  } catch (error: any) {
    console.error('❌ Webhook handler error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};
