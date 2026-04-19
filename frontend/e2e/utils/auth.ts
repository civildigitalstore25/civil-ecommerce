import { expect, type Page } from '@playwright/test';

const TEST_EMAIL = 'softzcart@gmail.com';
const TEST_PASSWORD = 'Soft123@';

export async function clearAuthState(page: Page): Promise<void> {
  await page.evaluate(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('fullName');
  });
}

export async function signInAsAdmin(page: Page): Promise<void> {
  await page.goto('/signin');
  await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible();

  await page.locator('input[type="email"]').first().fill(TEST_EMAIL);
  await page.locator('input[type="password"]').first().fill(TEST_PASSWORD);
  await page.getByRole('button', { name: 'Sign In' }).click();

  await expect(page).toHaveURL(/\/$/);
}

export async function signUpAsTestUser(
  page: Page,
  details?: {
    fullName?: string;
    email?: string;
    password?: string;
    phoneNumber?: string;
  },
): Promise<{ fullName: string; email: string; password: string; phoneNumber: string }> {
  const stamp = Date.now();
  const fullName = details?.fullName ?? `E2E User ${stamp}`;
  const email = details?.email ?? `e2e-user-${stamp}@example.com`;
  const password = details?.password ?? 'Soft123!';
  const phoneNumber = details?.phoneNumber ?? '9876543210';

  const response = await page.request.post('http://localhost:5000/api/auth/register', {
    data: {
      email,
      password,
      fullName,
      phoneNumber,
      countryCode: '+91',
    },
  });

  expect(response.ok()).toBeTruthy();

  const authData = await response.json() as {
    token: string;
    user: {
      id: string;
      email: string;
      role: string;
      fullName?: string;
    };
  };

  await page.goto('/');
  await page.evaluate((data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('email', data.user.email);
    localStorage.setItem('role', data.user.role);
    localStorage.setItem('userId', data.user.id);
    if (data.user.fullName) {
      localStorage.setItem('fullName', data.user.fullName);
    }
  }, authData);

  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Explore Products' })).toBeVisible({
    timeout: 20000,
  });

  return { fullName, email, password, phoneNumber };
}

export async function openAdminPage(page: Page, path: string): Promise<void> {
  await page.goto(path);
  await expect(page).toHaveURL(new RegExp(path.replace('/', '\\/') + '$'));
}
