/** Best-effort message from an axios-style error shape */
export function axiosErrorMessage(err: unknown, fallback: string): string {
  if (typeof err === "object" && err !== null && "response" in err) {
    const data = (err as { response?: { data?: { message?: string } } }).response
      ?.data;
    if (data && typeof data.message === "string") return data.message;
  }
  return fallback;
}
