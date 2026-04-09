import { test, expect } from '@playwright/test';
import { signInAsAdmin } from './utils/auth';

test.describe('Authentication Flows', () => {
  test('user can sign in with test account', async ({ page }) => {
    await signInAsAdmin(page);
    await expect(page.getByRole('button', { name: 'Explore Products' })).toBeVisible();
  });

  test('signed in user can open admin orders page', async ({ page }) => {
    await signInAsAdmin(page);

    await page.goto('/admin/orders');
    await expect(page).toHaveURL(/\/admin\/orders$/);
  });
});
