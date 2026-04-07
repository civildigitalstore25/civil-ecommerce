/** Strip invisible chars and odd pipe-like glyphs from product names for breadcrumbs. */
export function normalizeProductDetailBreadcrumbName(name: string): string {
  return name
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(
      /[|\u007C\u00A6\u01C0\u01C1\u01C2\u2502\u2551\uFF5C\u239C\u23AA\u23B8\u23D0]+/g,
      "",
    )
    .replace(/\s{2,}/g, " ")
    .trim();
}
