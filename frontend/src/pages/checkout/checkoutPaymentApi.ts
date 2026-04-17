function apiBase(): string {
  return import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
}

function authJsonHeaders(token: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function postPaymentsCreateOrder(
  token: string,
  orderData: unknown,
): Promise<unknown> {
  const response = await fetch(`${apiBase()}/api/payments/create-order`, {
    method: "POST",
    headers: authJsonHeaders(token),
    body: JSON.stringify(orderData),
  });
  return response.json();
}

export async function postPaymentsFailed(
  token: string,
  body: unknown,
): Promise<void> {
  await fetch(`${apiBase()}/api/payments/failed`, {
    method: "POST",
    headers: authJsonHeaders(token),
    body: JSON.stringify(body),
  });
}

export async function postPaymentsVerify(
  token: string,
  body: unknown,
): Promise<unknown> {
  const response = await fetch(`${apiBase()}/api/payments/verify`, {
    method: "POST",
    headers: authJsonHeaders(token),
    body: JSON.stringify(body),
  });
  return response.json();
}
