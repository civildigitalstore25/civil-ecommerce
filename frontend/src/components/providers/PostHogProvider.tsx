import { useEffect, useRef, type ReactNode } from "react";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useAuth } from "../../api/auth";
import {
  buildPostHogPersonTraits,
  getPostHogHost,
  getPostHogInitOptions,
  getPostHogKey,
  identifyUser,
  posthogShouldTrack,
  resetUser,
  resolveCanonicalUserId,
} from "../../lib/analytics/posthog-client";

function PostHogIdentitySync() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const wasAuthenticatedRef = useRef(false);

  useEffect(() => {
    if (!posthogShouldTrack() || !posthog.__loaded || isLoading) return;

    const userId = resolveCanonicalUserId(user);
    if (isAuthenticated && userId) {
      identifyUser(userId, buildPostHogPersonTraits(user!));
      wasAuthenticatedRef.current = true;
      return;
    }

    if (wasAuthenticatedRef.current) {
      resetUser();
      wasAuthenticatedRef.current = false;
    }
  }, [user, isAuthenticated, isLoading]);

  return null;
}

export function PostHogProvider({ children }: { children: ReactNode }) {
  const shouldTrack = posthogShouldTrack();
  const posthogKey = getPostHogKey();
  const posthogHost = getPostHogHost();

  useEffect(() => {
    if (!shouldTrack || !posthogKey || !posthogHost) return;
    if (typeof window !== "undefined" && !posthog.__loaded) {
      posthog.init(posthogKey, getPostHogInitOptions());
    }
  }, [shouldTrack, posthogKey, posthogHost]);

  if (!shouldTrack) {
    return <>{children}</>;
  }

  return (
    <PHProvider client={posthog}>
      <PostHogIdentitySync />
      {children}
    </PHProvider>
  );
}
