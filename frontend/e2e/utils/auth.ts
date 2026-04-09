import { expect, type Page } from '@playwright/test';

const TEST_EMAIL = 'softzcart@gmail.com';
const TEST_PASSWORD = 'Soft123@';

export async function signInAsAdmin(page: Page): Promise<void> {
  await page.goto('/signin');
  await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible();

  await page.locator('input[type="email"]').first().fill(TEST_EMAIL);
  await page.locator('input[type="password"]').first().fill(TEST_PASSWORD);
  await page.getByRole('button', { name: 'Sign In' }).click();

  await expect(page).toHaveURL(/\/$/);
}

export async function openAdminPage(page: Page, path: string): Promise<void> {
  await page.goto(path);
  await expect(page).toHaveURL(new RegExp(path.replace('/', '\\/') + '$'));
}
