import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export interface GuestCheckoutRequest {
  email: string;
  fullName: string;
  phoneNumber: string;
}

export interface GuestCheckoutResponse {
  token: string;
  user: {
    id: string;
    email: string;
    fullName?: string;
    phoneNumber?: string;
    role: string;
    permissions?: string[];
  };
  isNewGuest: boolean;
}

export class GuestCheckoutAccountExistsError extends Error {
  code = "ACCOUNT_EXISTS" as const;

  constructor(message: string) {
    super(message);
    this.name = "GuestCheckoutAccountExistsError";
  }
}

export async function guestCheckoutAuth(
  payload: GuestCheckoutRequest,
): Promise<GuestCheckoutResponse> {
  try {
    const { data } = await axios.post<GuestCheckoutResponse>(
      `${API_BASE_URL}/api/auth/guest-checkout`,
      payload,
    );
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 409) {
      const message =
        (error.response.data as { message?: string })?.message ||
        "An account with this email already exists. Please sign in to continue.";
      throw new GuestCheckoutAccountExistsError(message);
    }
    throw error;
  }
}

export function formatCheckoutPhoneNumber(
  countryCode: string,
  whatsapp: string,
): string {
  const digits = whatsapp.replace(/\D/g, "");
  const codeDigits = countryCode.replace(/\D/g, "");

  // PhoneInput stores the country code in `whatsapp` already — avoid doubling it.
  if (codeDigits && digits.startsWith(codeDigits)) {
    return `+${digits}`;
  }

  const code = countryCode.startsWith("+") ? countryCode : `+${countryCode}`;
  return `${code}${digits}`;
}
