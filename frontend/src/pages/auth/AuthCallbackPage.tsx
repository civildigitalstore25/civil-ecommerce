import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { saveAuth } from "../../utils/auth";
import { useCurrentUser } from "../../api/auth";
import { useUserInvalidate } from "../../api/userQueries";

// ─── Module-level singleton ───────────────────────────────────────────────────
// Google OAuth causes a full page reload before landing on /auth/callback, so
// this variable is always fresh when this module first loads.
// We capture the redirect path ONCE from localStorage here (at module evaluation
// time, before React even mounts the component) so that React StrictMode's
// double-invoke of useEffect always sees the same value – even after the first
// effect run has already cleared the localStorage key.
// ─────────────────────────────────────────────────────────────────────────────
const AUTH_REDIRECT_KEY = "softzcart_auth_redirect";

function readAndClearRedirect(): string {
  try {
    const path = localStorage.getItem(AUTH_REDIRECT_KEY);
    if (path && path.startsWith("/") && path !== "/signin" && path !== "/signup") {
      localStorage.removeItem(AUTH_REDIRECT_KEY);
      return path;
    }
  } catch {
    // ignore storage errors
  }
  return "/";
}

// Captured once when this JS module is first evaluated (i.e. on page load).
// All subsequent calls from StrictMode re-renders reuse this cached value.
const GOOGLE_POST_AUTH_REDIRECT = readAndClearRedirect();

// ─────────────────────────────────────────────────────────────────────────────

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const invalidateUser = useUserInvalidate();
  const { refetch } = useCurrentUser();

  useEffect(() => {
    const handleGoogleAuthCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");

        if (token) {
          localStorage.setItem("token", token);

          const { data: userData } = await refetch();

          if (userData) {
            saveAuth({
              token,
              email: userData.email,
              role: userData.role,
              userId: userData.id,
              fullName: userData.fullName,
            });
            invalidateUser();

            // Both StrictMode runs navigate to the same product page ✅
            navigate(GOOGLE_POST_AUTH_REDIRECT, { replace: true });
          } else {
            throw new Error("Failed to fetch user data");
          }
        } else {
          navigate("/signin");
        }
      } catch (error) {
        console.error("Auth callback failed:", error);
        navigate("/signin");
      }
    };

    handleGoogleAuthCallback();
  }, [navigate, invalidateUser, refetch]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Completing login...
        </h2>
        <p className="text-gray-600 mt-2">Please wait while we redirect you.</p>
      </div>
    </div>
  );
}
