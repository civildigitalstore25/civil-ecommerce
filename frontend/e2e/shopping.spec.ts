import { test, expect } from '@playwright/test';

async function dismissWelcomePopup(page: Parameters<typeof test>[0]['page']) {
  const closeButton = page.locator('.welcome-popup-close');

  if (await closeButton.isVisible().catch(() => false)) {
    await closeButton.click({ force: true });
  }
}

test.describe('Shopping Experience', () => {
  test('home page renders hero content', async ({ page }) => {
    await page.goto('/');

    await expect(
      page.getByRole('heading', {
        name: 'Softzcart – Authorized Software Reseller',
        level: 1,
      }),
    ).toBeVisible();
    await expect(page.getByRole('button', { name: 'Explore Products' })).toBeVisible();
  });

  test('explore products opens product listing', async ({ page }) => {
    await page.goto('/');
    await dismissWelcomePopup(page);
    await page.getByRole('button', { name: 'Explore Products' }).click();

    await expect(page).toHaveURL(/\/products/);
    await expect(
      page.getByRole('heading', { name: 'Software Product Categories' }),
    ).toBeVisible();
  });
});
