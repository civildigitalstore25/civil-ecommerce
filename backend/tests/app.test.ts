import request from 'supertest';
import bcrypt from 'bcryptjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

function createSelectableUser(user: any) {
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
    createOrder: vi.fn().mockResolvedValue({ success: true, orderId: 'CF-1', paymentSessionId: 'SESSION-1', amount: 100, currency: 'INR' }),
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

const { authUsers, authTokens, mockUserSave, mockOrderSave, mockEmailService, mockCashfreeService, mockPostPaymentStatus, mockUserModel, mockOrderModel, mockProductModel, mockCouponModel } = mocks;

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

import app from '../app';

const setAuthUser = (token: string, user: any) => {
  authTokens.set(token, user._id.toString());
  authUsers.set(user._id.toString(), createSelectableUser(user));
};

const authHeader = (token: string) => ({ Authorization: `Bearer ${token}` });

beforeEach(() => {
  authUsers.clear();
  authTokens.clear();
  mockUserSave.mockReset();
  mockOrderSave.mockReset();

  mockEmailService.sendPasswordResetEmail.mockReset();
  mockEmailService.sendOrderConfirmationToAdmin.mockResolvedValue(undefined);
  mockEmailService.sendPurchaseConfirmationEmail.mockResolvedValue(undefined);
  mockEmailService.testConnection.mockResolvedValue(true);

  mockCashfreeService.createOrder.mockResolvedValue({ success: true, orderId: 'CF-1', paymentSessionId: 'SESSION-1', amount: 100, currency: 'INR' });
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

describe('auth flows', () => {
  it('registers a user and returns a token', async () => {
    mockUserModel.findOne.mockResolvedValue(null);
    mockUserSave.mockResolvedValue({
      _id: 'user-101',
      email: 'buyer@example.com',
      fullName: 'Buyer One',
      phoneNumber: '+15550001111',
      role: 'user',
      permissions: []
    });

    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'buyer@example.com',
        password: 'Secret123!',
        fullName: 'Buyer One',
        phoneNumber: '+15550001111'
      });

    expect(response.status).toBe(201);
    expect(response.body.user.email).toBe('buyer@example.com');
    expect(response.body.user.role).toBe('user');
    expect(response.body.token).toEqual(expect.any(String));
  });

  it('logs a user in with a valid password', async () => {
    const hashedPassword = await bcrypt.hash('Secret123!', 12);

    mockUserModel.findOne.mockResolvedValue({
      _id: 'user-102',
      email: 'buyer@example.com',
      fullName: 'Buyer One',
      phoneNumber: '+15550001111',
      role: 'user',
      permissions: [],
      password: hashedPassword
    });

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'buyer@example.com',
        password: 'Secret123!'
      });

    expect(response.status).toBe(200);
    expect(response.body.user.email).toBe('buyer@example.com');
    expect(response.body.user.role).toBe('user');
    expect(response.body.token).toEqual(expect.any(String));
  });
});

describe('user and admin operations', () => {
  it('lists all users for an admin', async () => {
    const adminUser = {
      _id: 'admin-1',
      email: 'admin@example.com',
      fullName: 'Admin One',
      role: 'admin',
      permissions: ['users', 'orders']
    };

    setAuthUser('admin-token', adminUser);

    const users = [
      { _id: 'user-1', email: 'buyer@example.com', fullName: 'Buyer One', role: 'user' },
      { _id: 'user-2', email: 'member@example.com', fullName: 'Member Two', role: 'user' }
    ];

    mockUserModel.find.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      sort: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      skip: vi.fn().mockResolvedValue(users)
    });
    mockUserModel.countDocuments.mockResolvedValue(users.length);

    const response = await request(app)
      .get('/api/users')
      .set(authHeader('admin-token'));

    expect(response.status).toBe(200);
    expect(response.body.users).toHaveLength(2);
    expect(response.body.total).toBe(2);
  });

  it('creates a new admin for a superadmin', async () => {
    const superadminUser = {
      _id: 'super-1',
      email: 'super@example.com',
      fullName: 'Super Admin',
      role: 'superadmin',
      permissions: ['*']
    };

    setAuthUser('super-token', superadminUser);
    mockUserModel.findOne.mockResolvedValue(null);
    mockUserSave.mockResolvedValue({
      _id: 'admin-2',
      email: 'newadmin@example.com',
      fullName: 'New Admin',
      phoneNumber: '+15550002222',
      role: 'admin',
      permissions: ['users', 'orders']
    });

    const response = await request(app)
      .post('/api/superadmin/admins')
      .set(authHeader('super-token'))
      .send({
        email: 'newadmin@example.com',
        password: 'Secret123!',
        fullName: 'New Admin',
        phoneNumber: '+15550002222',
        permissions: ['users', 'orders', 'invalid-permission']
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(mockUserSave).toHaveBeenCalled();
  });

  it('updates admin permissions for a superadmin', async () => {
    const superadminUser = {
      _id: 'super-1',
      email: 'super@example.com',
      fullName: 'Super Admin',
      role: 'superadmin',
      permissions: ['*']
    };

    const targetAdmin = {
      _id: 'admin-target',
      email: 'target@example.com',
      fullName: 'Target Admin',
      role: 'admin',
      permissions: ['users'],
      save: vi.fn().mockResolvedValue(undefined)
    };

    setAuthUser('super-token', superadminUser);
    authUsers.set('admin-target', createSelectableUser(targetAdmin));

    const response = await request(app)
      .patch('/api/superadmin/admins/admin-target/permissions')
      .set(authHeader('super-token'))
      .send({ permissions: ['users', 'orders', 'not-real'] });

    expect(response.status).toBe(200);
    expect(response.body.admin.permissions).toEqual(['users', 'orders']);
    expect(targetAdmin.save).toHaveBeenCalled();
  });
});

describe('order flows', () => {
  it('places a free user order successfully', async () => {
    const user = {
      _id: 'user-201',
      email: 'shopper@example.com',
      fullName: 'Shopper One',
      role: 'user',
      permissions: []
    };

    setAuthUser('user-token', user);

    mockProductModel.find.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      lean: vi.fn().mockResolvedValue([
        {
          _id: '507f1f77bcf86cd799439011',
          driveLink: 'https://drive.example.com/file',
          name: 'Civil Guide',
          company: 'Civil Co',
          brand: 'SoftZCart'
        }
      ])
    });
    mockOrderSave.mockResolvedValue({
      _id: 'order-1',
      orderId: 'CIV-1234',
      orderNumber: 1001
    });

    const response = await request(app)
      .post('/api/payments/create-order')
      .set(authHeader('user-token'))
      .send({
        items: [
          {
            productId: '507f1f77bcf86cd799439011',
            name: 'Civil Guide',
            quantity: 1,
            price: 0
          }
        ],
        subtotal: 0,
        discount: 0,
        shippingCharges: 0,
        totalAmount: 0,
        shippingAddress: {
          fullName: 'Shopper One',
          phoneNumber: '+15550003333',
          addressLine1: '123 Main Street',
          city: 'Bhopal',
          state: 'MP',
          pincode: '462001',
          country: 'India'
        }
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.isFreeOrder).toBe(true);
  });

  it('creates an admin order successfully', async () => {
    const adminUser = {
      _id: 'admin-201',
      email: 'admin@example.com',
      fullName: 'Admin One',
      role: 'admin',
      permissions: ['orders']
    };

    setAuthUser('admin-token', adminUser);

    mockProductModel.find.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      lean: vi.fn().mockResolvedValue([
        {
          _id: '507f1f77bcf86cd799439012',
          driveLink: 'https://drive.example.com/admin-file',
          name: 'Admin Bundle',
          company: 'Civil Co',
          brand: 'SoftZCart'
        }
      ])
    });
    mockOrderSave.mockResolvedValue({
      _id: 'order-2',
      orderId: 'ADM-5678',
      orderNumber: 1002
    });

    const response = await request(app)
      .post('/api/payments/admin/orders')
      .set(authHeader('admin-token'))
      .send({
        email: 'customer@example.com',
        items: [
          {
            productId: '507f1f77bcf86cd799439012',
            name: 'Admin Bundle',
            quantity: 1,
            price: 1499
          }
        ],
        subtotal: 1499,
        discount: 0,
        totalAmount: 1499,
        notes: 'Manual admin order'
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(mockOrderSave).toHaveBeenCalled();
  });
});