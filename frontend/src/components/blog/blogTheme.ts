/**
 * Blog UI theme – solid app colors only (no gradients).
 * Matches app primary blue used across the site.
 */
export const blogTheme = {
  /** Primary action: buttons, links, accents */
  primary: "#2563eb", // blue-600
  primaryHover: "#1d4ed8", // blue-700
  /** Category/tag background (solid) */
  tagBg: "#dbeafe", // blue-100
  tagText: "#1d4ed8", // blue-800
  /** Neutral text and borders */
  text: "#1e293b",
  textMuted: "#64748b",
  border: "#e2e8f0",
  /** Page background */
  pageBg: "#f9fafb",
  cardBg: "#ffffff",
} as const;
