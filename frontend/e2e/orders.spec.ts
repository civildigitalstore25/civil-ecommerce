import { test, expect } from '@playwright/test';

test.describe('Order Flow', () => {
  test('protected orders route redirects to signin', async ({ page }) => {
    await page.goto('/my-orders');

    await expect(page).toHaveURL(/\/signin$/);
    await expect(
      page.getByText('Sign in to access your software licenses and downloads'),
    ).toBeVisible();
  });
});
