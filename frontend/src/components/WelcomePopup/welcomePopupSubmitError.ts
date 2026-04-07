interface LeadErrorBody {
  error?: string;
  isRegistered?: boolean;
  alreadyClaimed?: boolean;
}

function readAxiosErrorData(error: unknown): LeadErrorBody | null {
  if (typeof error !== "object" || error === null) return null;
  const response = (error as { response?: { data?: unknown } }).response;
  const data = response?.data;
  if (typeof data !== "object" || data === null) return null;
  return data as LeadErrorBody;
}

/** Maps API / network failures to a user-visible message and optional “don’t show again”. */
export function parseWelcomeLeadSubmitError(error: unknown): {
  message: string;
  completeWelcomePopup?: boolean;
} {
  const body = readAxiosErrorData(error);
  if (body?.error) {
    const complete = Boolean(body.isRegistered || body.alreadyClaimed);
    return { message: body.error, completeWelcomePopup: complete };
  }
  return { message: "Something went wrong. Please try again." };
}
