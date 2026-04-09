import { test, expect } from '@playwright/test';
import { openAdminPage, signInAsAdmin } from './utils/auth';
import { confirmSweetAlert, waitForSweetAlertsToClose } from './utils/swal';

test.describe('Admin Products CRUD', () => {
  test('admin can add edit and delete a product', async ({ page }) => {
    const productName = `E2E Product ${Date.now()}`;
    const updatedProductName = `${productName} Updated`;

    await signInAsAdmin(page);
    await openAdminPage(page, '/admin/products');

    await page.getByRole('button', { name: 'Add Product' }).click();

    const modal = page.locator('div[role="dialog"], div.fixed.inset-0').first();
    await expect(page.getByRole('heading', { name: /Add New Product|Edit Product/i })).toBeVisible();

    await modal.getByPlaceholder('e.g., AutoCAD 2025').fill(productName);
    await modal.getByPlaceholder('e.g., 2025.1 (optional)').fill('2026.1');

    await modal.locator('select').nth(0).selectOption('autodesk');
    await modal.locator('select').nth(1).selectOption('autocad');

    await modal.getByPlaceholder('https://example.com/image.jpg').fill('https://picsum.photos/seed/e2e-product/800/600');

    await modal
      .locator('div:has(label:has-text("Price INR (₹)")) input[type="number"]')
      .first()
      .fill('999');

    await modal.getByRole('button', { name: 'Add Product' }).click();
    await confirmSweetAlert(page, /create/i);
    await waitForSweetAlertsToClose(page);

    await page.getByPlaceholder('Search products...').fill(productName);
    const createdRow = page.locator('tbody tr', { hasText: productName }).first();
    await expect(createdRow).toBeVisible({ timeout: 20000 });

    await createdRow.locator('button').nth(1).click();
    await expect(page.getByRole('heading', { name: /Edit Product/i })).toBeVisible();

    await modal.getByPlaceholder('e.g., AutoCAD 2025').fill(updatedProductName);
    await modal.getByRole('button', { name: 'Update Product' }).click();
    await confirmSweetAlert(page, /update/i);
    await waitForSweetAlertsToClose(page);

    await page.getByPlaceholder('Search products...').fill(updatedProductName);
    const updatedRow = page.locator('tbody tr', { hasText: updatedProductName }).first();
    await expect(updatedRow).toBeVisible({ timeout: 20000 });

    await updatedRow.locator('button').nth(2).click();
    await confirmSweetAlert(page, /delete/i);
    await waitForSweetAlertsToClose(page);

    await expect(page.locator('tbody tr', { hasText: updatedProductName })).toHaveCount(0, {
      timeout: 20000,
    });
  });
});
