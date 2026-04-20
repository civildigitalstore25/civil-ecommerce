import { expect, test } from '@playwright/test';
import { clearAuthState, signInAsAdmin } from './utils/auth';
import {
  addFreeCartItem,
  createFreeOrderForCurrentUser,
  getFirstProduct,
  updateOrderStatusAsAdmin,
} from './utils/data';

test.describe('User Remaining Feature Coverage', () => {
  test('visitor can register and sign in', async ({ page }) => {
    const stamp = Date.now();
    const fullName = `E2E Signup ${stamp}`;
    const email = `e2e-signup-${stamp}@example.com`;
    const password = 'Soft123!';

    const registerResponse = await page.request.post('http://localhost:5000/api/auth/register', {
      data: {
        email,
        password,
        fullName,
        phoneNumber: '9876543210',
        countryCode: '+91',
      },
    });
    expect(registerResponse.ok()).toBeTruthy();

    const payload = (await registerResponse.json()) as { token?: string; user?: { email?: string; role?: string; id?: string; fullName?: string } };
    if (!payload.token || !payload.user?.email || !payload.user?.role || !payload.user?.id) {
      throw new Error('Registration did not return complete auth payload');
    }

    await page.goto('/');
    await page.evaluate((auth) => {
      localStorage.setItem('token', auth.token);
      localStorage.setItem('email', auth.user.email ?? '');
      localStorage.setItem('role', auth.user.role ?? 'user');
      localStorage.setItem('userId', auth.user.id ?? '');
      if (auth.user.fullName) {
        localStorage.setItem('fullName', auth.user.fullName);
      }
    }, payload as { token: string; user: { email: string; role: string; id: string; fullName?: string } });

    await page.reload();
    await expect(page).toHaveURL(/\/$/, { timeout: 20000 });
    await expect(page.getByRole('button', { name: 'Explore Products' })).toBeVisible();

    await clearAuthState(page);
  });

  test('signed-in user can update profile details', async ({ page }) => {
    const updatedName = `Softzcart E2E ${Date.now()}`;

    await signInAsAdmin(page);

    const token = await page.evaluate(() => localStorage.getItem('token'));
    if (!token) {
      throw new Error('Missing token for profile update');
    }

    const profileResponse = await page.request.put('http://localhost:5000/api/auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        fullName: updatedName,
        phoneNumber: '9123456789',
      },
    });
    expect(profileResponse.ok()).toBeTruthy();

    await page.goto('/profile');
    await expect(page.getByRole('heading', { name: updatedName })).toBeVisible({ timeout: 20000 });
  });

  test('signed-in user can manage cart items', async ({ page }) => {
    await signInAsAdmin(page);

    const product = await getFirstProduct(page);
    await addFreeCartItem(page, product._id);

    await page.goto('/cart');
    await expect(page.getByRole('heading', { name: 'Shopping Cart' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Proceed to Checkout' })).toBeVisible();

    const token = await page.evaluate(() => localStorage.getItem('token'));
    if (!token) {
      throw new Error('Missing token for cart clear');
    }

    const clearResponse = await page.request.delete('http://localhost:5000/api/cart/clear', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    expect(clearResponse.ok()).toBeTruthy();

    await page.reload();

    await expect(
      page.getByRole('main').getByRole('heading', { name: 'Your cart is empty' }),
    ).toBeVisible({ timeout: 20000 });
  });

  test('user sees my orders and receives admin status updates', async ({ page }) => {
    await signInAsAdmin(page);

    const product = await getFirstProduct(page);
    const created = await createFreeOrderForCurrentUser(page, {
      fullName: 'Softzcart E2E',
      phoneNumber: '9876543210',
      productId: product._id,
      productName: product.name,
    });

    await updateOrderStatusAsAdmin(page, created.orderId, 'delivered');

    const ordersPage = await page.context().newPage();
    await ordersPage.goto('/my-orders');
    await expect(ordersPage.getByRole('heading', { name: 'My Orders' })).toBeVisible();

    await expect(ordersPage.getByText('Success').first()).toBeVisible({ timeout: 20000 });
    await ordersPage.close();
  });
});
