import type { Blog } from "../../api/types/blogTypes";
import type { SEOMetadata } from "./seoTypes";
import { buildCanonicalUrl, getPublicSiteOrigin } from "./siteOrigin";
import { clampMetaDescription, trimTitleForMeta } from "./seoText";

const BRAND_SUFFIX = " | Softzcart";

function absolutizeAssetUrl(url: string | undefined): string {
  if (!url || !url.trim()) return "";
  const u = url.trim();
  if (/^https?:\/\//i.test(u)) return u;
  const origin = getPublicSiteOrigin();
  return u.startsWith("/") ? `${origin}${u}` : `${origin}/${u}`;
}

export function getBlogListSEO(): SEOMetadata {
  const description = clampMetaDescription(
    "Software guides, tutorials, and product tips for engineers and designers. Read the latest from Softzcart.",
  );
  return {
    title: trimTitleForMeta(`Blog - Guides & News${BRAND_SUFFIX}`, 70),
    description,
    keywords:
      "softzcart blog, software tutorials, autocad tips, design guides, engineering software news",
    ogTitle: "Blog - Guides & News | Softzcart",
    ogDescription: description,
  };
}

export type BlogDetailSEO = SEOMetadata & {
  canonicalUrl: string;
  ogImage: string;
};

export function getBlogDetailSEO(blog: Blog): BlogDetailSEO {
  const titleBase = (blog.metaTitle?.trim() || blog.title).replace(/\s+/g, " ");
  const titleWithBrand = titleBase.toLowerCase().includes("softzcart")
    ? titleBase
    : `${titleBase}${BRAND_SUFFIX}`;
  const title = trimTitleForMeta(titleWithBrand, 70);

  const rawDesc =
    blog.metaDescription?.trim() ||
    blog.excerpt?.trim() ||
    `${blog.title} — ${blog.category} on Softzcart.`;
  const description = clampMetaDescription(rawDesc);

  const kwFromApi = blog.metaKeywords?.filter(Boolean).join(", ");
  const keywordsRaw =
    kwFromApi ||
    [blog.title, blog.category, ...blog.tags.slice(0, 8), "softzcart blog"].join(", ");
  const keywords = keywordsRaw.length > 500 ? `${keywordsRaw.slice(0, 497)}...` : keywordsRaw;

  const canonicalUrl = buildCanonicalUrl(`/blog/${blog.slug}`);
  const ogImage = absolutizeAssetUrl(blog.featuredImage);

  return {
    title,
    description,
    keywords,
    ogTitle: trimTitleForMeta(titleBase, 70),
    ogDescription: description,
    canonicalUrl,
    ogImage,
  };
}
