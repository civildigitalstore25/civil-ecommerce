/** Auto-generate product slug from name + optional version (legacy default). */
export function productSlugFromNameVersion(name: string, version?: string): string {
  const versionPart = version?.trim()
    ? `-${version.toString().trim().toLowerCase()}`
    : "";
  return `${name.replace(/\s+/g, "-").toLowerCase()}${versionPart}`;
}
