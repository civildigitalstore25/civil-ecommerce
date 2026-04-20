import { beforeEach, vi } from 'vitest';

export function createSelectableUser(user: any) {
  if (!user) return null;

  return {
    ...user,
    select: vi.fn().mockResolvedValue(user)
  };
}

const mocks = vi.hoisted(() => {
  const authUsers = new Map<string, any>();
  const authTokens = new Map<string, string>();
  const mockUserSave = vi.fn();
  const mockOrderSave = vi.fn();
  const mockEmailService = {
    sendPasswordResetEmail: vi.fn(),
    sendOrderConfirmationToAdmin: vi.fn().mockResolvedValue(undefined),
    sendPurchaseConfirmationEmail: vi.fn().mockResolvedValue(undefined),
    testConnection: vi.fn().mockResolvedValue(true)
  };
  const mockCashfreeService = {
    createOrder: vi.fn().mockResolvedValue({
      success: true,
      orderId: 'CF-1',
      paymentSessionId: 'SESSION-1',
      amount: 100,
      currency: 'INR'
    }),
    getOrderDetails: vi.fn(),
    getPaymentDetails: vi.fn(),
    initiateRefund: vi.fn()
  };
  const mockPostPaymentStatus = vi.fn().mockReturnValue('processing');
  const mockUserModel = vi.fn().mockImplementation(function (this: any, data: any) {
    Object.assign(this, data);
  }) as any;
  mockUserModel.prototype.save = mockUserSave;
  mockUserModel.prototype.toObject = function () {
    return { ...this };
  };
  mockUserModel.findOne = vi.fn();
  mockUserModel.findById = vi.fn((id: string) => createSelectableUser(authUsers.get(id) || null));
  mockUserModel.find = vi.fn();
  mockUserModel.countDocuments = vi.fn();
  mockUserModel.findByIdAndUpdate = vi.fn();
  const mockOrderModel = vi.fn().mockImplementation(function (this: any, data: any) {
    Object.assign(this, data);
  }) as any;
  mockOrderModel.prototype.save = mockOrderSave;
  mockOrderModel.prototype.populate = vi.fn(function (this: any) {
    return Promise.resolve(this);
  });
  mockOrderModel.findOne = vi.fn();
  mockOrderModel.find = vi.fn();
  mockOrderModel.countDocuments = vi.fn();
  mockOrderModel.findById = vi.fn();
  const mockProductModel = {
    find: vi.fn()
  };
  const mockCouponModel = {
    findOne: vi.fn()
  };

  return {
    authUsers,
    authTokens,
    mockUserSave,
    mockOrderSave,
    mockEmailService,
    mockCashfreeService,
    mockPostPaymentStatus,
    mockUserModel,
    mockOrderModel,
    mockProductModel,
    mockCouponModel
  };
});

export const {
  authUsers,
  authTokens,
  mockUserSave,
  mockOrderSave,
  mockEmailService,
  mockCashfreeService,
  mockPostPaymentStatus,
  mockUserModel,
  mockOrderModel,
  mockProductModel,
  mockCouponModel
} = mocks;

vi.mock('../middlewares/auth', () => ({
  authenticate: (req: any, res: any, next: any) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Authentication required.'
      });
    }

    const userId = mocks.authTokens.get(token);
    const user = userId ? mocks.authUsers.get(userId) : null;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found. Token invalid.'
      });
    }

    req.user = user;
    return next();
  },
  requireAdmin: (req: any, res: any, next: any) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    if (user.role !== 'admin' && user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required. Insufficient permissions.'
      });
    }

    return next();
  },
  requireSuperadmin: (req: any, res: any, next: any) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    if (user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Superadmin access required. Insufficient permissions.'
      });
    }

    return next();
  },
  optionalAuth: (req: any, _res: any, next: any) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return next();
    }

    const userId = mocks.authTokens.get(token);
    if (userId) {
      req.user = mocks.authUsers.get(userId);
    }

    return next();
  },
  requirePermission: (permission: string) => (req: any, res: any, next: any) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    if (user.role === 'superadmin') {
      return next();
    }

    if (user.role === 'admin' && Array.isArray(user.permissions) && user.permissions.includes(permission)) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: `Access denied. Required permission: ${permission}`
    });
  }
}));

vi.mock('../models/User', () => ({
  default: mocks.mockUserModel
}));

vi.mock('../models/Order', () => ({
  default: mocks.mockOrderModel,
  coerceLegacyOrderStatus: (status: string | undefined | null) => {
    const normalized = (status || '').toLowerCase();
    if (normalized === 'shipped') return 'processing';
    if (['pending', 'processing', 'delivered', 'cancelled'].includes(normalized)) {
      return normalized;
    }
    return 'pending';
  }
}));

vi.mock('../models/Product', () => ({
  default: mocks.mockProductModel
}));

vi.mock('../models/Coupon', () => ({
  default: mocks.mockCouponModel
}));

vi.mock('../services/emailService', () => ({
  default: mocks.mockEmailService
}));

vi.mock('../services/cashfreeService', () => ({
  default: mocks.mockCashfreeService
}));

vi.mock('../utils/orderEbookStatus', () => ({
  postPaymentOrderStatusForOrderItems: mocks.mockPostPaymentStatus
}));

export const setAuthUser = (token: string, user: any) => {
  authTokens.set(token, user._id.toString());
  authUsers.set(user._id.toString(), createSelectableUser(user));
};

export const authHeader = (token: string) => ({ Authorization: `Bearer ${token}` });

beforeEach(() => {
  authUsers.clear();
  authTokens.clear();
  mockUserSave.mockReset();
  mockOrderSave.mockReset();

  mockEmailService.sendPasswordResetEmail.mockReset();
  mockEmailService.sendOrderConfirmationToAdmin.mockResolvedValue(undefined);
  mockEmailService.sendPurchaseConfirmationEmail.mockResolvedValue(undefined);
  mockEmailService.testConnection.mockResolvedValue(true);

  mockCashfreeService.createOrder.mockResolvedValue({
    success: true,
    orderId: 'CF-1',
    paymentSessionId: 'SESSION-1',
    amount: 100,
    currency: 'INR'
  });
  mockCashfreeService.getOrderDetails.mockReset();
  mockCashfreeService.getPaymentDetails.mockReset();
  mockCashfreeService.initiateRefund.mockReset();

  mockPostPaymentStatus.mockReturnValue('processing');

  mockUserModel.findOne.mockReset();
  mockUserModel.findById.mockImplementation((id: string) => createSelectableUser(authUsers.get(id) || null));
  mockUserModel.find.mockReset();
  mockUserModel.countDocuments.mockReset();
  mockUserModel.findByIdAndUpdate.mockReset();

  mockOrderModel.findOne.mockReset();
  mockOrderModel.findOne.mockImplementation(() => {
    const chain: any = {};
    chain.sort = vi.fn().mockReturnValue(chain);
    chain.select = vi.fn().mockReturnValue(chain);
    chain.lean = vi.fn().mockResolvedValue(null);
    return chain;
  });
  mockOrderModel.find.mockReset();
  mockOrderModel.countDocuments.mockReset();
  mockOrderModel.findById.mockReset();

  mockProductModel.find.mockReset();
  mockCouponModel.findOne.mockReset();
});
