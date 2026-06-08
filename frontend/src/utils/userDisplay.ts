/** Shared initials helper for profile and blog author display. */
export function getProfileInitials(name?: string): string {
  if (!name) return "";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");
}
