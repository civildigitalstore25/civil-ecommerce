import { Request, Response } from 'express';
import Order from '../models/Order';
import { coerceLegacyOrderStatus } from '../models/Order';
import {
  calculateExpiryDate,
  inferLicenseType,
  isLicenseExpired,
  getDaysSinceExpiry,
  formatDateDisplay,
  type LicenseType,
} from '../utils/licenseExpiryUtils';

interface ExpiredProductRecord {
  _id: string;
  orderId: string;
  orderNumber: number;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  productId: string;
  productName: string;
  purchaseDate: Date;
  licenseType: string;
  licenseExpiryDate: Date;
  daysSinceExpiry: number;
  itemIndex: number;
  amount: number;
}

const normalizePaymentStatus = (status: string | undefined | null): string => {
  const normalized = (status || '').toLowerCase().trim();
  if (normalized === 'success' || normalized === 'completed') {
    return 'paid';
  }
  return normalized;
};

const isPaidLikeStatus = (status: string | undefined | null): boolean => {
  const normalized = normalizePaymentStatus(status);
  return normalized === 'paid' || normalized === 'refunded';
};

const normalizeOrderStatus = (status: string | undefined | null): string => {
  const normalized = (status || '').toLowerCase().trim();
  if (normalized === 'success') {
    return 'delivered';
  }
  return coerceLegacyOrderStatus(normalized);
};

const isCompleteOrderStatus = (status: string | undefined | null): boolean => {
  const normalized = normalizeOrderStatus(status);
  return normalized === 'processing' || normalized === 'delivered';
};

const getEffectiveLicenseType = (item: any): LicenseType | null => {
  const rawLicenseType =
    typeof item?.licenseType === 'string' ? item.licenseType.toLowerCase().trim() : '';

  if (
    rawLicenseType === '1year' ||
    rawLicenseType === '3year' ||
    rawLicenseType === '5minute' ||
    rawLicenseType === 'lifetime'
  ) {
    return rawLicenseType as LicenseType;
  }

  const inferred = inferLicenseType(
    typeof item?.pricingPlan === 'string' ? item.pricingPlan : undefined
  );

  return inferred || null;
};

const getEffectiveLicenseExpiryDate = (
  item: any,
  order: { createdAt?: Date; updatedAt?: Date }
): Date | null => {
  if (item?.licenseExpiryDate) {
    const fromItem = new Date(item.licenseExpiryDate);
    if (!Number.isNaN(fromItem.getTime())) {
      return fromItem;
    }
  }

  const effectiveLicenseType = getEffectiveLicenseType(item);
  if (!effectiveLicenseType || effectiveLicenseType === 'lifetime') {
    return null;
  }

  const baseDate = order.updatedAt || order.createdAt;
  if (!baseDate) {
    return null;
  }

  return calculateExpiryDate(new Date(baseDate), effectiveLicenseType);
};

/**
 * GET /api/expiry/expired
 * Retrieve all orders with expired licenses
 * Query params: search, page, pageSize
 */
export const getExpiredProducts = async (req: Request, res: Response) => {
  try {
    const { search = '', page = 1, pageSize = 10 } = req.query;
    const pageNum = parseInt(page as string, 10) || 1;
    const pageSizeNum = parseInt(pageSize as string, 10) || 10;
    const skip = (pageNum - 1) * pageSizeNum;

    // Fetch candidate orders and apply robust status/license filtering in code.
    const orders = await Order.find({
      paymentStatus: {
        $in: ['paid', 'refunded', 'success', 'completed'],
      },
    })
      .populate<{ userId?: any }>('userId', 'fullName phoneNumber')
      .sort({ createdAt: -1 })
      .lean();

    // Process and filter for expired licenses
    let expiredProducts: ExpiredProductRecord[] = [];

    for (const order of orders) {
      if (!isPaidLikeStatus(order.paymentStatus) || !isCompleteOrderStatus(order.orderStatus)) {
        continue;
      }

      for (let itemIndex = 0; itemIndex < order.items.length; itemIndex++) {
        const item = order.items[itemIndex];
        const licenseType = getEffectiveLicenseType(item);
        const effectiveExpiryDate = getEffectiveLicenseExpiryDate(item, order);

        // Only include non-lifetime items with valid effective expiry dates.
        if (!licenseType || licenseType === 'lifetime' || !effectiveExpiryDate) {
          continue;
        }

        // Check if expired
        if (!isLicenseExpired(effectiveExpiryDate)) {
          continue;
        }

        const daysSinceExpiry = getDaysSinceExpiry(effectiveExpiryDate);

        const record: ExpiredProductRecord = {
          _id: `${order._id}-${itemIndex}`,
          orderId: order.orderId,
          orderNumber: order.orderNumber,
          customerEmail: order.customerEmail || '',
          customerName: order.shippingAddress?.fullName || 'Unknown',
          customerPhone: order.shippingAddress?.phoneNumber || '',
          productId: item.productId,
          productName: item.name,
          purchaseDate: order.createdAt,
          licenseType,
          licenseExpiryDate: effectiveExpiryDate,
          daysSinceExpiry,
          itemIndex,
          amount: item.price,
        };

        expiredProducts.push(record);
      }
    }

    // Apply search filter
    if (search) {
      const searchLower = (search as string).toLowerCase();
      expiredProducts = expiredProducts.filter(
        (record) =>
          record.customerName.toLowerCase().includes(searchLower) ||
          record.customerEmail.toLowerCase().includes(searchLower) ||
          record.productName.toLowerCase().includes(searchLower) ||
          record.orderId.toLowerCase().includes(searchLower)
      );
    }

    // Sort by most recently expired
    expiredProducts.sort(
      (a, b) =>
        new Date(b.licenseExpiryDate).getTime() -
        new Date(a.licenseExpiryDate).getTime()
    );

    // Get pagination info
    const totalCount = expiredProducts.length;
    const totalPages = Math.ceil(totalCount / pageSizeNum);

    // Apply pagination
    const paginatedData = expiredProducts.slice(skip, skip + pageSizeNum);

    // Format response data
    const formattedData = paginatedData.map((record) => ({
      ...record,
      licenseExpiryDate: record.licenseExpiryDate.toISOString(),
      purchaseDate: record.purchaseDate.toISOString(),
      expiryDateDisplay: formatDateDisplay(record.licenseExpiryDate),
    }));

    return res.json({
      success: true,
      data: formattedData,
      pagination: {
        currentPage: pageNum,
        pageSize: pageSizeNum,
        totalCount,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching expired products:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch expired products',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * GET /api/expiry/expiring
 * Retrieve orders with licenses expiring within a specific number of days
 * Query params: daysUntil (default 30), page, pageSize
 */
export const getExpiringProducts = async (req: Request, res: Response) => {
  try {
    const { daysUntil = 30, page = 1, pageSize = 10, search = '' } = req.query;
    const daysNum = parseInt(daysUntil as string, 10) || 30;
    const pageNum = parseInt(page as string, 10) || 1;
    const pageSizeNum = parseInt(pageSize as string, 10) || 10;
    const skip = (pageNum - 1) * pageSizeNum;

    // Calculate the future date range
    const now = new Date();
    const futureDate = new Date(now);
    futureDate.setDate(futureDate.getDate() + daysNum);

    // Fetch candidate orders and apply robust status/license filtering in code.
    const orders = await Order.find({
      paymentStatus: {
        $in: ['paid', 'refunded', 'success', 'completed'],
      },
    })
      .populate<{ userId?: any }>('userId', 'fullName phoneNumber')
      .sort({ createdAt: -1 })
      .lean();

    // Process results
    let expiringProducts: ExpiredProductRecord[] = [];

    for (const order of orders) {
      if (!isPaidLikeStatus(order.paymentStatus) || !isCompleteOrderStatus(order.orderStatus)) {
        continue;
      }

      for (let itemIndex = 0; itemIndex < order.items.length; itemIndex++) {
        const item = order.items[itemIndex];
        const licenseType = getEffectiveLicenseType(item);
        const expiryDate = getEffectiveLicenseExpiryDate(item, order);

        if (!licenseType || licenseType === 'lifetime' || !expiryDate) {
          continue;
        }

        if (expiryDate <= now || expiryDate > futureDate) {
          continue;
        }

        const daysSinceExpiry = getDaysSinceExpiry(expiryDate);

        const record: ExpiredProductRecord = {
          _id: `${order._id}-${itemIndex}`,
          orderId: order.orderId,
          orderNumber: order.orderNumber,
          customerEmail: order.customerEmail || '',
          customerName: order.shippingAddress?.fullName || 'Unknown',
          customerPhone: order.shippingAddress?.phoneNumber || '',
          productId: item.productId,
          productName: item.name,
          purchaseDate: order.createdAt,
          licenseType,
          licenseExpiryDate: expiryDate,
          daysSinceExpiry,
          itemIndex,
          amount: item.price,
        };

        expiringProducts.push(record);
      }
    }

    // Apply search filter
    if (search) {
      const searchLower = (search as string).toLowerCase();
      expiringProducts = expiringProducts.filter(
        (record) =>
          record.customerName.toLowerCase().includes(searchLower) ||
          record.customerEmail.toLowerCase().includes(searchLower) ||
          record.productName.toLowerCase().includes(searchLower) ||
          record.orderId.toLowerCase().includes(searchLower)
      );
    }

    // Sort by nearest expiry date
    expiringProducts.sort(
      (a, b) =>
        new Date(a.licenseExpiryDate).getTime() -
        new Date(b.licenseExpiryDate).getTime()
    );

    const totalCount = expiringProducts.length;
    const totalPages = Math.ceil(totalCount / pageSizeNum);
    const paginatedData = expiringProducts.slice(skip, skip + pageSizeNum);

    const formattedData = paginatedData.map((record) => ({
      ...record,
      licenseExpiryDate: record.licenseExpiryDate.toISOString(),
      purchaseDate: record.purchaseDate.toISOString(),
      expiryDateDisplay: formatDateDisplay(record.licenseExpiryDate),
    }));

    return res.json({
      success: true,
      data: formattedData,
      pagination: {
        currentPage: pageNum,
        pageSize: pageSizeNum,
        totalCount,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching expiring products:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch expiring products',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * GET /api/expiry/stats
 * Get summary statistics about expired and expiring licenses
 */
export const getExpiryStats = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({
      paymentStatus: {
        $in: ['paid', 'refunded', 'success', 'completed'],
      },
    }).lean();

    let expiredCount = 0;
    let expiringIn7Days = 0;
    let expiringIn30Days = 0;

    const now = new Date();
    const sevenDaysLater = new Date(now);
    sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);
    const thirtyDaysLater = new Date(now);
    thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);

    for (const order of orders) {
      if (!isPaidLikeStatus(order.paymentStatus) || !isCompleteOrderStatus(order.orderStatus)) {
        continue;
      }

      for (const item of order.items) {
        const licenseType = getEffectiveLicenseType(item);
        const expiryDate = getEffectiveLicenseExpiryDate(item, order);

        if (!licenseType || licenseType === 'lifetime' || !expiryDate) {
          continue;
        }

        if (expiryDate < now) {
          expiredCount++;
        } else if (expiryDate <= sevenDaysLater) {
          expiringIn7Days++;
        } else if (expiryDate <= thirtyDaysLater) {
          expiringIn30Days++;
        }
      }
    }

    return res.json({
      success: true,
      stats: {
        expiredCount,
        expiringIn7Days,
        expiringIn30Days,
      },
    });
  } catch (error) {
    console.error('Error fetching expiry stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch expiry stats',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * GET /api/expiry/debug/:orderId
 * Diagnostic endpoint to check why an order isn't showing in expired/expiring sections
 */
export const debugOrderExpiry = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ orderId }).lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order not found: ${orderId}`,
      });
    }

    const now = new Date();
    const checks = {
      orderFound: true,
      orderId: order.orderId,
      orderNumber: order.orderNumber,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      normalizedPaymentStatus: normalizePaymentStatus(order.paymentStatus),
      normalizedOrderStatus: normalizeOrderStatus(order.orderStatus),
      paymentStatusValid: isPaidLikeStatus(order.paymentStatus),
      orderStatusValid: isCompleteOrderStatus(order.orderStatus),
      createdAt: order.createdAt,
      currentTime: now,
      items: order.items.map((item: any, idx: number) => {
        const effectiveLicenseType = getEffectiveLicenseType(item);
        const licenseExpiryDate = getEffectiveLicenseExpiryDate(item, order);
        const isExpired = licenseExpiryDate ? now > licenseExpiryDate : false;
        const daysSinceExpiry =
          licenseExpiryDate && isExpired
            ? Math.floor((now.getTime() - licenseExpiryDate.getTime()) / (1000 * 60 * 60 * 24))
            : null;

        return {
          itemIndex: idx,
          name: item.name,
          rawLicenseType: item.licenseType || 'not-set',
          effectiveLicenseType: effectiveLicenseType || 'unknown',
          pricingPlan: item.pricingPlan || null,
          rawLicenseExpiryDate: item.licenseExpiryDate || null,
          licenseExpiryDate,
          isExpired,
          daysSinceExpiry,
          isLifetime: effectiveLicenseType === 'lifetime',
        };
      }),
    };

    const shouldAppearInExpired = checks.paymentStatusValid &&
      checks.orderStatusValid &&
      checks.items.some((item: any) => item.isExpired && !item.isLifetime);

    return res.json({
      success: true,
      data: {
        ...checks,
        shouldAppearInExpired,
        reasons: {
          paymentStatusOk: checks.paymentStatusValid
            ? '✓ Payment status is paid/refunded'
            : `✗ Payment status is "${checks.paymentStatus}" (normalized: "${checks.normalizedPaymentStatus}", need paid/refunded)`,
          orderStatusOk: checks.orderStatusValid
            ? '✓ Order status is delivered/processing'
            : `✗ Order status is "${checks.orderStatus}" (normalized: "${checks.normalizedOrderStatus}", need delivered/processing)`,
          licenseExpirySet: checks.items.some((i: any) => i.licenseExpiryDate)
            ? '✓ At least one item has effective licenseExpiryDate'
            : '✗ No items have effective licenseExpiryDate',
          licenseExpired: checks.items.some((i: any) => i.isExpired && !i.isLifetime)
            ? '✓ At least one item is expired (not lifetime)'
            : '✗ No expired non-lifetime licenses',
        },
      },
    });
  } catch (error) {
    console.error('Error debugging order expiry:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to debug order expiry',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
