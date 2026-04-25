import { expect, test } from '@playwright/test';
import { confirmSweetAlert, waitForSweetAlertsToClose } from './utils/swal';
import { openAdminPage, signInAsAdmin } from './utils/auth';
import { loginAdminAndGetToken } from './utils/data';

test.describe('Admin Remaining Feature Coverage', () => {
  test('admin can create update and delete a user', async ({ page }) => {
    const stamp = Date.now();
    const email = `e2e-admin-user-${stamp}@example.com`;
    const fullName = `E2E Admin User ${stamp}`;

    await signInAsAdmin(page);
    await openAdminPage(page, '/admin');

    const adminToken = await loginAdminAndGetToken(page);
    const createResponse = await page.request.post('http://localhost:5000/api/users', {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
      data: {
        email,
        fullName,
        phoneNumber: '9876543210',
        role: 'user',
        password: 'Soft123!',
      },
    });
    expect(createResponse.ok()).toBeTruthy();

    const createdUser = (await createResponse.json()) as { _id?: string; id?: string };
    const userId = createdUser._id || createdUser.id;
    if (!userId) {
      throw new Error('User creation did not return an id');
    }

    await page.getByRole('button', { name: 'Users' }).click();
    await expect(page.getByRole('heading', { name: 'User Management' })).toBeVisible();

    const userSearchInput = page.locator('input[placeholder="Search users..."]');
    await expect(userSearchInput).toBeVisible({ timeout: 15000 });
    await userSearchInput.fill(email);

    const row = page.locator('tbody tr', { hasText: email }).first();
    await expect(row).toBeVisible({ timeout: 20000 });

    await row.locator('select').first().selectOption('admin');
    await row.getByRole('button', { name: 'Update' }).click();

    await confirmSweetAlert(page, /updated to admin/i);
    await waitForSweetAlertsToClose(page);

    const deleteResponse = await page.request.delete(`http://localhost:5000/api/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });
    expect(deleteResponse.ok()).toBeTruthy();

    const verifyResponse = await page.request.get('http://localhost:5000/api/users', {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
      params: {
        search: email,
        limit: 20,
      },
    });
    expect(verifyResponse.ok()).toBeTruthy();
    const verifyPayload = (await verifyResponse.json()) as { users?: Array<{ email?: string }> };
    expect(verifyPayload.users?.some((item) => item.email === email)).toBeFalsy();
  });

  test('admin can create a menu from menu management page', async ({ page }) => {
    const stamp = Date.now();
    const menuName = `E2E Menu ${stamp}`;
    const menuSlug = `e2e-menu-${stamp}`;

    await signInAsAdmin(page);
    await openAdminPage(page, '/admin/menus');

    await expect(page.getByRole('heading', { name: 'Menu Management' })).toBeVisible();

    const adminToken = await loginAdminAndGetToken(page);
    const createResponse = await page.request.post('http://localhost:5000/api/menus', {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
      data: {
        name: menuName,
        slug: menuSlug,
        type: 'category',
        order: 1,
        isActive: true,
      },
    });
    expect(createResponse.ok()).toBeTruthy();

    await page.reload();

    await expect(page.getByText(menuName)).toBeVisible({ timeout: 20000 });
    await expect(page.getByText(`Slug: ${menuSlug}`)).toBeVisible({ timeout: 20000 });
  });

  test('admin can create order, update status in bulk, view details and delete order', async ({ page }) => {
    const stamp = Date.now();
    const customerEmail = `order-e2e-${stamp}@example.com`;
    const customerName = `E2E Customer ${stamp}`;
    const customerPhone = '9876543210';
    const productId = `e2e-product-${stamp}`;

    await signInAsAdmin(page);
    await openAdminPage(page, '/admin/orders');

    await expect(page.getByRole('heading', { name: 'Orders Management' })).toBeVisible();

    const adminToken = await loginAdminAndGetToken(page);
    const createOrderResponse = await page.request.post(
      'http://localhost:5000/api/payments/admin/orders',
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
        data: {
          email: customerEmail,
          customerName,
          customerPhone,
          items: [
            {
              productId,
              name: 'E2E Admin Order Product',
              quantity: 1,
              price: 799,
            },
          ],
          subtotal: 799,
          discount: 0,
          totalAmount: 799,
          notes: `Email: ${customerEmail}`,
        },
      },
    );
    expect(createOrderResponse.ok()).toBeTruthy();

    await page.reload();

    await page.getByPlaceholder('Enter customer name or email...').fill(customerEmail);

    const row = page.locator('tbody tr', { hasText: customerEmail }).first();
    await expect(row).toBeVisible({ timeout: 20000 });

    await row.locator('button[title="View order details"]').click();
    await expect(page.getByRole('heading', { name: 'Order Details' })).toBeVisible();
    await page.getByRole('button', { name: 'Close', exact: true }).click();

    await row.locator('td').first().locator('input[type="checkbox"]').check();
    await page.locator('select').filter({ has: page.locator('option[value="success"]') }).first().selectOption('success');
    await page.getByRole('button', { name: 'Update Status' }).click();

    await confirmSweetAlert(page, /Update Status\?/i);
    await waitForSweetAlertsToClose(page);

    await expect(
      page.locator('tbody tr', { hasText: customerEmail }).first().getByText('Success'),
    ).toBeVisible({ timeout: 20000 });

    await page
      .locator('tbody tr', { hasText: customerEmail })
      .first()
      .locator('button[title="Delete order"]')
      .click();
    await confirmSweetAlert(page, /Delete Order\?/i);
    await waitForSweetAlertsToClose(page);

    await expect(page.locator('tbody tr', { hasText: customerEmail })).toHaveCount(0, {
      timeout: 20000,
    });
  });
});
