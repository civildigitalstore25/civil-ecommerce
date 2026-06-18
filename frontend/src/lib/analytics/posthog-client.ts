import posthog from "posthog-js";
import type { User } from "../../api/auth";

const POSTHOG_KEY = import.meta.env.VITE_PUBLIC_POSTHOG_KEY?.trim() ?? "";
const POSTHOG_HOST = import.meta.env.VITE_PUBLIC_POSTHOG_HOST?.trim() ?? "";
const ENABLE_IN_DEV =
  import.meta.env.VITE_PUBLIC_POSTHOG_ENABLE_IN_DEV?.trim().toLowerCase() ===
  "true";

/** PostHog runs when key+host are set and (production build, or dev opt-in). */
export function posthogShouldTrack(): boolean {
  if (!POSTHOG_KEY || !POSTHOG_HOST) return false;
  return import.meta.env.PROD || ENABLE_IN_DEV;
}

export function getPostHogKey(): string {
  return POSTHOG_KEY;
}

export function getPostHogHost(): string {
  return POSTHOG_HOST;
}

export function getPostHogInitOptions() {
  return {
    api_host: POSTHOG_HOST,
    ui_host: "https://us.posthog.com",
    person_profiles: "identified_only" as const,
    capture_pageview: false,
    capture_pageleave: true,
    session_recording: {
      maskAllInputs: true,
      maskTextSelector: "[data-sensitive]",
    },
  };
}

/** MongoDB `_id` on `/current-user` or `id` from login — both map to User PK. */
export function resolveCanonicalUserId(
  user: User | Record<string, unknown> | null | undefined
): string | null {
  if (!user) return null;
  const record = user as User & { _id?: string };
  const id = record.id ?? record._id;
  return id ? String(id) : null;
}

export function buildPostHogPersonTraits(
  user: User | Record<string, unknown>
): Record<string, string> {
  const record = user as User;
  const traits: Record<string, string> = {};
  if (record.email) traits.email = record.email;
  if (record.fullName) traits.name = record.fullName;
  if (record.role) traits.role = record.role;
  return traits;
}

function isReady(): boolean {
  return (
    typeof window !== "undefined" && !!posthog.__loaded && posthogShouldTrack()
  );
}

export function trackPostHogEvent(
  eventName: string,
  properties?: Record<string, unknown>
): void {
  if (isReady()) posthog.capture(eventName, properties);
}

export function identifyUser(
  userId: string,
  properties?: Record<string, unknown>
): void {
  if (isReady()) posthog.identify(userId, properties);
}

export function resetUser(): void {
  if (isReady()) posthog.reset();
}

export function setUserProperties(properties: Record<string, unknown>): void {
  if (isReady()) posthog.setPersonProperties(properties);
}

export function getPostHog(): typeof posthog | null {
  return isReady() ? posthog : null;
}
