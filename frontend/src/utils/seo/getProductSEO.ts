import type { SEOMetadata } from "./seoTypes";
import {
  PRODUCT_META_DESCRIPTION_MAX,
  stripHtmlToPlainText,
  clampMetaDescription,
  trimTitleForMeta,
} from "./seoText";
import { buildProductKeywords } from "./productKeywordBuilder";

const TITLE_MAX_LEN = 70;
const KEYWORDS_MAX_LEN = 500;

function buildProductTitle(name: string): string {
  const n = name.trim().replace(/\s+/g, " ");
  if (!n) return "Product | Softzcart";
  const suffix = " | Softzcart";
  if (n.toLowerCase().includes("softzcart")) {
    return trimTitleForMeta(n, TITLE_MAX_LEN);
  }
  const withSuffix = n + suffix;
  if (withSuffix.length <= TITLE_MAX_LEN) return withSuffix;
  return trimTitleForMeta(n, TITLE_MAX_LEN);
}

function firstNonEmptyPlainText(...htmlChunks: (string | undefined)[]): string {
  for (const chunk of htmlChunks) {
    const plain = stripHtmlToPlainText(chunk || "").trim();
    if (plain) return plain;
  }
  return "";
}

function buildProductMetaDescription(input: {
  name: string;
  shortDescription?: string;
  descriptionHtml?: string;
  detailsDescriptionHtml?: string;
  overallFeaturesHtml?: string;
  requirementsHtml?: string;
  price?: number;
}): string {
  const short = input.shortDescription?.trim();
  let plain =
    short ||
    firstNonEmptyPlainText(
      input.descriptionHtml,
      input.detailsDescriptionHtml,
      input.overallFeaturesHtml,
      input.requirementsHtml,
    );

  if (!plain) {
    plain = `${input.name.trim()}. Available on Softzcart.`;
  }

  if (input.price && input.price > 0) {
    plain = `${plain} From ₹${input.price}.`;
  }
  return clampMetaDescription(plain, PRODUCT_META_DESCRIPTION_MAX);
}

export function getProductSEO(product: {
  name: string;
  category?: string;
  company?: string;
  brand?: string;
  shortDescription?: string;
  description?: string;
  detailsDescription?: string;
  overallFeatures?: string;
  requirements?: string;
  tags?: string[];
  price?: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
}): SEOMetadata {
  const shortPlain = product.shortDescription?.trim() || "";
  const descriptionPlain = [
    stripHtmlToPlainText(product.description || ""),
    stripHtmlToPlainText(product.detailsDescription || ""),
    stripHtmlToPlainText(product.overallFeatures || ""),
    stripHtmlToPlainText(product.requirements || ""),
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  const seoTitleTrim = product.seoTitle?.trim() || "";
  const title = seoTitleTrim
    ? trimTitleForMeta(seoTitleTrim, TITLE_MAX_LEN)
    : buildProductTitle(product.name);

  const seoDescTrim = product.seoDescription?.trim() || "";
  const description = seoDescTrim
    ? clampMetaDescription(seoDescTrim, PRODUCT_META_DESCRIPTION_MAX)
    : buildProductMetaDescription({
        name: product.name,
        shortDescription: product.shortDescription,
        descriptionHtml: product.description,
        detailsDescriptionHtml: product.detailsDescription,
        overallFeaturesHtml: product.overallFeatures,
        requirementsHtml: product.requirements,
        price: product.price,
      });

  const seoKwTrim = product.seoKeywords?.trim() || "";
  const keywords = seoKwTrim
    ? seoKwTrim.slice(0, KEYWORDS_MAX_LEN)
    : buildProductKeywords({
        name: product.name,
        category: product.category,
        company: product.company,
        brand: product.brand,
        shortPlain,
        descriptionPlain,
        tags: product.tags,
      });

  return {
    title,
    description,
    keywords,
    ogTitle: title,
    ogDescription: description,
  };
}
