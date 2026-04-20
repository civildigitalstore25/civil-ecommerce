import { expect, type Page } from '@playwright/test';

const API_BASE_URL = 'http://localhost:5000';

export type BasicProduct = {
  _id: string;
  name: string;
};

export async function getAuthToken(page: Page): Promise<string> {
  const token = await page.evaluate(() => localStorage.getItem('token'));
  if (!token) {
    throw new Error('Missing auth token in localStorage');
  }
  return token;
}

export async function getFirstProduct(page: Page): Promise<BasicProduct> {
  const response = await page.request.get(`${API_BASE_URL}/api/products?limit=1`);
  expect(response.ok()).toBeTruthy();

  const payload = (await response.json()) as { products?: BasicProduct[] };
  const product = payload.products?.[0];

  if (!product?._id) {
    throw new Error('No products found for test data setup');
  }

  return product;
}

export async function addFreeCartItem(page: Page, productId: string): Promise<void> {
  const token = await getAuthToken(page);

  const response = await page.request.post(`${API_BASE_URL}/api/cart/add`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      productId,
      licenseType: '1year',
      quantity: 1,
      subscriptionPlan: {
        planId: 'free',
        planLabel: 'Free',
        planType: 'free',
      },
    },
  });

  expect(response.ok()).toBeTruthy();
}

export async function createFreeOrderForCurrentUser(
  page: Page,
  args: {
    fullName: string;
    phoneNumber: string;
    productId: string;
    productName: string;
  },
): Promise<{ orderId: string }> {
  const token = await getAuthToken(page);

  const response = await page.request.post(`${API_BASE_URL}/api/payments/create-order`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      items: [
        {
          productId: args.productId,
          name: args.productName,
          quantity: 1,
          price: 0,
          pricingPlan: 'free',
        },
      ],
      subtotal: 0,
      discount: 0,
      shippingCharges: 0,
      totalAmount: 0,
      shippingAddress: {
        fullName: args.fullName,
        phoneNumber: args.phoneNumber,
        addressLine1: 'E2E Address',
        city: 'E2E City',
        state: 'E2E State',
        pincode: '560001',
        country: 'India',
      },
      notes: 'E2E free order',
    },
  });

  expect(response.ok()).toBeTruthy();

  const payload = (await response.json()) as {
    data?: { orderId?: string };
  };

  const orderId = payload.data?.orderId;
  if (!orderId) {
    throw new Error('Order creation succeeded but no orderId was returned');
  }

  return { orderId };
}

export async function loginAdminAndGetToken(page: Page): Promise<string> {
  const response = await page.request.post(`${API_BASE_URL}/api/auth/login`, {
    data: {
      email: 'softzcart@gmail.com',
      password: 'Soft123@',
    },
  });

  expect(response.ok()).toBeTruthy();

  const payload = (await response.json()) as { token?: string };
  if (!payload.token) {
    throw new Error('Admin login did not return a token');
  }

  return payload.token;
}

export async function updateOrderStatusAsAdmin(
  page: Page,
  orderId: string,
  orderStatus: 'processing' | 'delivered' | 'cancelled',
): Promise<void> {
  const adminToken = await loginAdminAndGetToken(page);

  const response = await page.request.put(
    `${API_BASE_URL}/api/payments/admin/orders/${orderId}/status`,
    {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
      data: {
        orderStatus,
      },
    },
  );

  expect(response.ok()).toBeTruthy();
}
