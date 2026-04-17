/**
 * Canonical public site origin (no trailing slash).
 * Set `VITE_PUBLIC_SITE_URL` in production (e.g. https://softzcart.com).
 */
export function getPublicSiteOrigin(): string {
  const raw = import.meta.env.VITE_PUBLIC_SITE_URL as string | undefined;
  const base = (raw && raw.trim()) || "https://softzcart.com";
  return base.replace(/\/+$/, "");
}

/** Absolute canonical URL for a pathname (query/hash stripped). */
export function buildCanonicalUrl(pathname: string): string {
  const origin = getPublicSiteOrigin();
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const onlyPath = path.split("?")[0]?.split("#")[0] ?? "/";
  if (onlyPath === "" || onlyPath === "/") {
    return `${origin}/`;
  }
  return `${origin}${onlyPath}`;
}
