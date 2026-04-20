import { test, expect } from '@playwright/test';
import { clearAuthState, signInAsAdmin, signUpAsTestUser } from './utils/auth';
import { confirmSweetAlert, waitForSweetAlertsToClose } from './utils/swal';

test.describe('Customer Review and Download Flows', () => {
  test('user can post a review and admin can reply', async ({ page }) => {
    await signUpAsTestUser(page, {
      fullName: `E2E User ${Date.now()}`,
      email: `e2e-user-${Date.now()}@example.com`,
      password: 'Soft123!',
      phoneNumber: '9876543210',
    });

    await page.goto('/category?brand=autodesk&category=autocad');

    const buyNowButton = page.getByRole('button', { name: 'BUY NOW' }).first();
    await expect(buyNowButton).toBeVisible({ timeout: 20000 });
    await buyNowButton.click();

    await expect(page).toHaveURL(/\/product\/.+$/);

    const productUrl = page.url();
    const reviewText = `E2E review ${Date.now()}`;
    const replyText = `E2E admin reply ${Date.now()}`;

    await page.getByRole('button', { name: /^Reviews/ }).click();
    await expect(page.getByRole('button', { name: 'Write a review' })).toBeVisible({
      timeout: 20000,
    });
    await page.getByRole('button', { name: 'Write a review' }).click();

    await page.getByPlaceholder('Share your experience with this product...').fill(reviewText);
    await page.getByRole('button', { name: 'Post Review' }).click();
    await confirmSweetAlert(page, /Review posted successfully/i);

    await expect(page.getByText(reviewText)).toBeVisible({ timeout: 20000 });

    await clearAuthState(page);
    await signInAsAdmin(page);
    await page.goto(productUrl);

    await page.getByRole('button', { name: /^Reviews/ }).click();

    const reviewCard = page.locator('div.rounded-xl').filter({ hasText: reviewText }).first();
    await expect(reviewCard).toBeVisible({ timeout: 20000 });
    await reviewCard.getByRole('button', { name: 'Reply' }).click();

    await expect(page.getByRole('heading', { name: 'Choose Reply Type' })).toBeVisible();
    await page.getByRole('button', { name: 'Reply as Admin' }).click();

    await page.getByPlaceholder('Write your reply...').fill(replyText);
    await page.getByRole('button', { name: 'Post Reply' }).click();
    await confirmSweetAlert(page, /Reply posted successfully/i);

    await expect(page.locator('div.rounded-xl').filter({ hasText: reviewText })).toContainText(
      replyText,
      { timeout: 20000 },
    );

    await waitForSweetAlertsToClose(page);
  });

  test('my orders page can download a purchased product', async ({ page }) => {
    const orderId = 'e2e-order-1';
    const productId = 'e2e-product-1';
    const downloadBody = 'mock download content';

    await page.route('**/api/payments/orders', async (route) => {
      await route.fulfill({
        status: 200,
        json: {
          success: true,
          data: [
            {
              _id: orderId,
              userId: 'e2e-user-1',
              orderId: 'ORD-E2E-1',
              orderNumber: 10001,
              items: [
                {
                  productId,
                  name: 'E2E Download Product',
                  quantity: 1,
                  price: 999,
                  image: 'https://picsum.photos/seed/e2e-download/200/200',
                  driveLink: 'https://drive.google.com/file/d/e2e',
                  canDownload: true,
                },
              ],
              subtotal: 999,
              discount: 0,
              shippingCharges: 0,
              totalAmount: 999,
              shippingAddress: {
                fullName: 'E2E Customer',
                phoneNumber: '9876543210',
                addressLine1: '123 Main Street',
                city: 'Mumbai',
                state: 'Maharashtra',
                pincode: '400001',
                country: 'India',
              },
              paymentStatus: 'paid',
              orderStatus: 'delivered',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        },
      });
    });

    await page.route(`**/api/download/${orderId}/${productId}/metadata`, async (route) => {
      await route.fulfill({
        status: 200,
        json: {
          success: true,
          data: {
            fileName: 'e2e-download.zip',
            mimeType: 'application/zip',
            sizeBytes: downloadBody.length,
          },
        },
      });
    });

    await page.route(`**/api/download/${orderId}/${productId}/secure`, async (route) => {
      await route.fulfill({
        status: 200,
        headers: {
          'content-type': 'application/zip',
          'content-disposition': 'attachment; filename="e2e-download.zip"',
          'content-length': String(downloadBody.length),
        },
        body: downloadBody,
      });
    });

    await signInAsAdmin(page);
    await page.goto('/my-orders');

    await expect(page.getByRole('heading', { name: 'My Orders' })).toBeVisible();

    const downloadButton = page.locator('button[title="Download product"]').first();
    await expect(downloadButton).toBeVisible();

    const metadataRequest = page.waitForRequest((request) =>
      request.url().includes(`/api/download/${orderId}/${productId}/metadata`),
    );
    const secureRequest = page.waitForRequest((request) =>
      request.url().includes(`/api/download/${orderId}/${productId}/secure`),
    );

    await downloadButton.click();
    await metadataRequest;
    await secureRequest;
    await expect(downloadButton).toBeEnabled({ timeout: 15000 });
  });
});