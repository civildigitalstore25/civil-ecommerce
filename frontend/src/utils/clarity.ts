/**
 * Microsoft Clarity – behavioral analytics (session replays, heatmaps, insights).
 * Only active when VITE_CLARITY_PROJECT_ID is set.
 */

import Clarity from "@microsoft/clarity";

const PROJECT_ID = import.meta.env.VITE_CLARITY_PROJECT_ID as string | undefined;

let initialized = false;

/**
 * Initialize Clarity. Call once at app startup (e.g. in main.tsx).
 * No-op if project ID is missing.
 */
export function initClarity(): void {
  if (typeof window === "undefined" || !PROJECT_ID || PROJECT_ID === "yourProjectId") {
    return;
  }
  if (initialized) return;
  try {
    Clarity.init(PROJECT_ID);
    initialized = true;
  } catch (e) {
    console.warn("[Clarity] init failed:", e);
  }
}

export function isClarityLoaded(): boolean {
  return initialized && !!PROJECT_ID;
}

/** Identify user/session/page for better filtering in Clarity (customId required). */
export function clarityIdentify(
  customId: string,
  customSessionId?: string,
  customPageId?: string,
  friendlyName?: string
): void {
  if (!isClarityLoaded()) return;
  try {
    Clarity.identify(customId, customSessionId, customPageId, friendlyName);
  } catch (e) {
    console.warn("[Clarity] identify failed:", e);
  }
}

/** Set custom tags for filtering sessions. */
export function claritySetTag(key: string, value: string | string[]): void {
  if (!isClarityLoaded()) return;
  try {
    Clarity.setTag(key, value);
  } catch (e) {
    console.warn("[Clarity] setTag failed:", e);
  }
}

/** Track a custom event (shows in Clarity filters/dashboard). */
export function clarityEvent(eventName: string): void {
  if (!isClarityLoaded()) return;
  try {
    Clarity.event(eventName);
  } catch (e) {
    console.warn("[Clarity] event failed:", e);
  }
}

/**
 * Cookie consent. Call when user accepts/denies cookies.
 * Use consentV2 for granular control; consent() for simple on/off.
 */
export function clarityConsent(granted: boolean): void {
  if (!isClarityLoaded()) return;
  try {
    Clarity.consent(granted);
  } catch (e) {
    console.warn("[Clarity] consent failed:", e);
  }
}

export function clarityConsentV2(options?: {
  ad_Storage: "granted" | "denied";
  analytics_Storage: "granted" | "denied";
}): void {
  if (!isClarityLoaded()) return;
  try {
    Clarity.consentV2(options);
  } catch (e) {
    console.warn("[Clarity] consentV2 failed:", e);
  }
}

/** Prioritize this session for recording (e.g. cart interactions). */
export function clarityUpgrade(reason: string): void {
  if (!isClarityLoaded()) return;
  try {
    Clarity.upgrade(reason);
  } catch (e) {
    console.warn("[Clarity] upgrade failed:", e);
  }
}
