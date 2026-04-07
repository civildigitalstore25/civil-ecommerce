import type { Product } from "../../api/types/productTypes";

function normalizeProductDetailText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function parseProductDetailSlug(slug: string): { productName: string; productVersion: string } {
  let productName = "";
  let productVersion = "";
  const cleanSlug = slug.replace(/-+$/, "");
  const lastHyphen = cleanSlug.lastIndexOf("-");
  if (lastHyphen !== -1) {
    productName = cleanSlug.substring(0, lastHyphen).replace(/-/g, " ");
    productVersion = cleanSlug.substring(lastHyphen + 1);
  } else {
    productName = cleanSlug.replace(/-/g, " ");
  }
  return { productName, productVersion };
}

export function findProductDetailBySlug(
  slug: string | undefined,
  productList: Product[] | undefined,
): Product | undefined {
  if (!slug || !productList?.length) return undefined;

  const { productName, productVersion } = parseProductDetailSlug(slug);

  return productList.find((p) => {
    const cleanInputSlug = slug.replace(/-+$/, "").toLowerCase();
    const cleanStoredSlug = p.slug?.replace(/-+$/, "").toLowerCase();
    const normalizedInput = normalizeProductDetailText(cleanInputSlug.replace(/-/g, " "));

    if (cleanStoredSlug && cleanStoredSlug === cleanInputSlug) return true;
    if (
      cleanStoredSlug &&
      normalizeProductDetailText(cleanStoredSlug.replace(/-/g, " ")) === normalizedInput
    ) {
      return true;
    }

    const normalizedProductName = normalizeProductDetailText((p.name || "").toString());
    const normalizedParsedName = normalizeProductDetailText(productName);
    const normalizedVersion = normalizeProductDetailText((p.version || "").toString());
    const normalizedParsedVersion = normalizeProductDetailText(productVersion);

    const nameMatch = normalizedProductName === normalizedParsedName;
    const versionMatch = productVersion
      ? normalizedVersion === normalizedParsedVersion
      : !normalizedVersion;

    if (nameMatch && versionMatch) return true;

    const fullNameMatch = normalizedProductName === normalizedInput;
    const noVersionOrEmpty = !normalizedVersion;

    return fullNameMatch && noVersionOrEmpty;
  });
}
