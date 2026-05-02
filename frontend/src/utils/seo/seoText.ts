/** Recommended max meta description length (under common ~155–173 SERP / tool limits). */
export const PRODUCT_META_DESCRIPTION_MAX = 172;

/** Strip HTML to plain text for SEO snippets (best-effort, no full entity decode). */
export function stripHtmlToPlainText(html: string): string {
  if (!html?.trim()) return "";
  let s = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/p>/gi, " ")
    .replace(/<\/(div|h[1-6]|li|tr)>/gi, " ")
    .replace(/<[^>]+>/g, " ");
  return s.replace(/\s+/g, " ").trim();
}

/** Trim title for HTML `<title>`: prefer word boundary under max length. */
export function trimTitleForMeta(title: string, maxLen = 65): string {
  const t = title.trim().replace(/\s+/g, " ");
  if (t.length <= maxLen) return t;
  const cut = t.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > Math.floor(maxLen * 0.55) ? cut.slice(0, lastSpace) : cut).trimEnd();
}

/** Meta description length clamp with word-aware ellipsis. */
export function clampMetaDescription(text: string, maxLen = 160): string {
  const t = text.trim().replace(/\s+/g, " ");
  if (t.length <= maxLen) return t;
  const budget = maxLen - 1;
  const cut = t.slice(0, budget);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 50 ? cut.slice(0, lastSpace) : cut).trimEnd() + "…";
}
