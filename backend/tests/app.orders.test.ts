import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import app from '../app';
import {
  authHeader,
  mockOrderSave,
  mockProductModel,
  setAuthUser
} from './httpTestEnv';

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
        customerName: 'Test Customer',
        customerPhone: '9876543210',
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
