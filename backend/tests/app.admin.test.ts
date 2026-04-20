import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import app from '../app';
import {
  authHeader,
  authUsers,
  createSelectableUser,
  mockUserModel,
  mockUserSave,
  setAuthUser
} from './httpTestEnv';

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
