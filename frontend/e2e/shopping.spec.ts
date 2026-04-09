import { test, expect } from '@playwright/test';

test.describe('Shopping Experience', () => {
  test('home page renders hero content', async ({ page }) => {
    await page.goto('/');

    await expect(
      page.getByRole('heading', {
        name: 'SoftzCart — Software & Ebooks for Engineers',
        level: 1,
      }),
    ).toBeVisible();
    await expect(page.getByRole('button', { name: 'Explore Products' })).toBeVisible();
  });

  test('explore products opens product listing', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Explore Products' }).click();

    await expect(page).toHaveURL(/\/products/);
    await expect(
      page.getByRole('heading', { name: 'Software Product Categories' }),
    ).toBeVisible();
  });
});
