export function parsePlanDurationMinutes(label: string | null | undefined): number | null {
  if (!label) return null;
  const normalized = label.trim().toLowerCase();
  if (!normalized) return null;
  if (normalized.includes("lifetime")) return null;

  const numberMatch = normalized.match(/\d+(?:\.\d+)?/);
  const value = numberMatch ? Number(numberMatch[0]) : null;

  if (normalized.includes("minute") || normalized.includes("min")) {
    return value ? Math.round(value) : null;
  }
  if (normalized.includes("hour")) {
    return value ? Math.round(value * 60) : null;
  }
  if (normalized.includes("day")) {
    return value ? Math.round(value * 24 * 60) : null;
  }
  if (normalized.includes("week")) {
    return value ? Math.round(value * 7 * 24 * 60) : null;
  }
  if (normalized.includes("quarter")) {
    return Math.round((value ?? 1) * 3 * 30 * 24 * 60);
  }
  if (normalized.includes("semi-annual") || normalized.includes("semi annual")) {
    return Math.round(6 * 30 * 24 * 60);
  }
  if (normalized.includes("month") || normalized.includes("monthly")) {
    return Math.round((value ?? 1) * 30 * 24 * 60);
  }
  if (normalized.includes("year") || normalized.includes("annual")) {
    return Math.round((value ?? 1) * 365 * 24 * 60);
  }
  if (normalized.includes("trial") && value) {
    return Math.round(value * 24 * 60);
  }

  return null;
}
