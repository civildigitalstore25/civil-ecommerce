export function truncateBannerText(s: string, n = 120): string {
  return s && s.length > n ? s.slice(0, n).trim() + "..." : s;
}
