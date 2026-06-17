const AUTH_REDIRECT_KEY = "softzcart_auth_redirect";

type RedirectState = {
  returnTo?: string;
  from?: {
    pathname?: string;
    search?: string;
    hash?: string;
    state?: unknown;
  };
};

const isSafeRedirectPath = (path: string | undefined): path is string =>
  !!path && path.startsWith("/") && path !== "/signin" && path !== "/signup";

export function saveAuthRedirect(returnTo: string) {
  if (!isSafeRedirectPath(returnTo)) return;

  try {
    localStorage.setItem(AUTH_REDIRECT_KEY, returnTo);
  } catch {
    // Ignore storage failures; router state is still passed as the primary path.
  }
}

export function resolveAuthRedirect(
  state: RedirectState | null | undefined,
  fallback = "/",
  search = "",
) {
  const queryReturnTo = new URLSearchParams(search).get("returnTo") || undefined;
  const from = state?.from;
  const fromPath = from?.pathname
    ? `${from.pathname}${from.search || ""}${from.hash || ""}`
    : undefined;

  if (isSafeRedirectPath(state?.returnTo)) return state.returnTo;
  if (isSafeRedirectPath(queryReturnTo)) return queryReturnTo;
  if (isSafeRedirectPath(fromPath)) return fromPath;

  try {
    const storedPath = localStorage.getItem(AUTH_REDIRECT_KEY) || undefined;
    if (isSafeRedirectPath(storedPath)) return storedPath;
  } catch {
    // Ignore storage failures and use the fallback.
  }

  return fallback;
}

export function clearAuthRedirect() {
  try {
    localStorage.removeItem(AUTH_REDIRECT_KEY);
  } catch {
    // Ignore storage failures.
  }
}
