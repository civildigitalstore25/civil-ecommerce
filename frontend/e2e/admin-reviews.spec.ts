import { test, expect } from '@playwright/test';
import { openAdminPage, signInAsAdmin } from './utils/auth';

test.describe('Admin Reviews Management', () => {
  test('admin can check all and edit a review', async ({ page }) => {
    await signInAsAdmin(page);
    await openAdminPage(page, '/admin');

    await expect(page.getByRole('button', { name: 'Reviews' })).toBeVisible({ timeout: 15000 });

    const reviewsTab = page.getByRole('button', { name: 'Reviews' });
    await expect(reviewsTab).toBeVisible({ timeout: 15000 });
    await reviewsTab.click();

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
    const firstReviewId = await firstRow.getAttribute('data-id').catch(() => null);

    await firstRow.getByRole('button', { name: 'Edit Review' }).click();
    await expect(page.getByRole('heading', { name: 'Edit Review' })).toBeVisible();

    const updatedComment = `Updated by Playwright ${Date.now()}`;
    await page.locator('textarea').fill(updatedComment);
    await page.getByRole('button', { name: 'Update' }).click();

    await expect(page.getByRole('heading', { name: 'Edit Review' })).toHaveCount(0, {
      timeout: 15000,
    });

    const token = await page.evaluate(() => localStorage.getItem('token'));
    if (!token) {
      throw new Error('Missing admin token for review verification');
    }

    const verifyResponse = await page.request.get('http://localhost:5000/api/reviews/admin/all?page=1&limit=50', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    expect(verifyResponse.ok()).toBeTruthy();

    const verifyPayload = (await verifyResponse.json()) as {
      reviews?: Array<{ _id?: string; comment?: string }>;
    };
    const updatedReview = verifyPayload.reviews?.find((review) => review.comment === updatedComment);
    expect(updatedReview).toBeTruthy();

    const deleteReviewId = updatedReview?._id || firstReviewId;
    if (!deleteReviewId) {
      throw new Error('Unable to determine review id for deletion');
    }

    const deleteResponse = await page.request.delete(`http://localhost:5000/api/reviews/${deleteReviewId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    expect(deleteResponse.ok()).toBeTruthy();

    if (originalSnippet && originalSnippet !== 'No reviews found') {
      await expect(page.getByText(updatedComment.substring(0, 30))).toHaveCount(0, {
        timeout: 20000,
      });
    }
  });
});
