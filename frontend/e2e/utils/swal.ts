import type { Locator, Page } from '@playwright/test';

export async function confirmSweetAlert(page: Page, textPattern?: RegExp): Promise<void> {
  const popup: Locator = page.locator('.swal2-popup');
  const visible = await popup.isVisible({ timeout: 4000 }).catch(() => false);

  if (!visible) {
    return;
  }

  if (textPattern) {
    await popup.getByText(textPattern).first().waitFor({ timeout: 5000 });
  }

  const confirmButton = popup.locator('.swal2-confirm');
  await confirmButton.click();
}

export async function waitForSweetAlertsToClose(page: Page): Promise<void> {
  await page.waitForSelector('.swal2-container', { state: 'hidden', timeout: 10000 }).catch(() => {});
}
