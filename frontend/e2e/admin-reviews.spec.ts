import { test, expect } from '@playwright/test';
import { openAdminPage, signInAsAdmin } from './utils/auth';
import { confirmSweetAlert } from './utils/swal';

test.describe('Admin Reviews Management', () => {
  test('admin can check all and edit a review', async ({ page }) => {
    await signInAsAdmin(page);
    await openAdminPage(page, '/admin/dashboard');

    const openSidebarButton = page.getByRole('button', { name: 'Open sidebar' });
    if (await openSidebarButton.isVisible().catch(() => false)) {
      await openSidebarButton.click();
    }

    await page.getByRole('button', { name: 'Reviews' }).click();

    await expect(page.getByRole('heading', { name: 'Reviews Management' })).toBeVisible();

    const noReviews = page.getByText('No reviews found');
    if (await noReviews.isVisible()) {
      await expect(noReviews).toBeVisible();
      return;
    }

    const headerCheckbox = page.locator('thead input[type="checkbox"]').first();
    await headerCheckbox.check();
    await expect(page.getByRole('button', { name: /Delete Selected/i })).toBeVisible();
    await headerCheckbox.uncheck();

    const firstRow = page.locator('tbody tr').first();
    const rowComment = firstRow.locator('td').nth(4);
    const originalSnippet = (await rowComment.innerText()).trim();

    await firstRow.getByRole('button', { name: 'Edit Review' }).click();
    await expect(page.getByRole('heading', { name: 'Edit Review' })).toBeVisible();

    const updatedComment = `Updated by Playwright ${Date.now()}`;
    await page.locator('textarea').fill(updatedComment);
    await page.getByRole('button', { name: 'Update' }).click();

    await expect(page.getByRole('heading', { name: 'Edit Review' })).toHaveCount(0, {
      timeout: 15000,
    });

    await expect(page.locator('tbody tr').first()).toContainText(updatedComment.substring(0, 30));

    await page.locator('tbody tr').first().getByRole('button', { name: 'Delete Review' }).click();
    await confirmSweetAlert(page, /Delete Review/i);

    if (originalSnippet && originalSnippet !== 'No reviews found') {
      await expect(page.getByText(updatedComment.substring(0, 30))).toHaveCount(0, {
        timeout: 20000,
      });
    }
  });
});
