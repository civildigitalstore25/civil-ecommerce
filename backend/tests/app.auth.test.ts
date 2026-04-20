import request from 'supertest';
import bcrypt from 'bcryptjs';
import { describe, expect, it } from 'vitest';
import app from '../app';
import { mockUserModel, mockUserSave } from './httpTestEnv';

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
