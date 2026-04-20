import { mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { productPathFromProduct } from "../src/utils/sitemap/productSlugPath";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "../public");

const STATIC_PATHS: string[] = [
  "/",
  "/products",
  "/contact",
  "/about-us",
  "/blog",
  "/sitemap",
  "/how-to-purchase",
  "/payment-method",
  "/deals",
  "/partner-program",
  "/category",
  "/autodesk",
  "/microsoft",
  "/adobe",
  "/antivirus",
  "/adobe-cloud",
  "/terms-and-conditions",
  "/privacy-policy",
  "/disclaimer",
  "/return-policy",
  "/shipping-policy",
];

function siteOrigin(): string {
  const raw = (process.env.VITE_PUBLIC_SITE_URL || "").trim() || "https://softzcart.com";
  return raw.replace(/\/+$/, "");
}

function absPath(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalized, `${siteOrigin()}/`).href;
}

function xmlEscape(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

type Entry = { loc: string; priority: string; changefreq: string };

function staticEntryMeta(path: string): Pick<Entry, "priority" | "changefreq"> {
  if (path === "/") return { priority: "1.0", changefreq: "daily" };
  if (path === "/products") return { priority: "0.9", changefreq: "daily" };
  if (["/deals"].includes(path)) return { priority: "0.7", changefreq: "daily" };
  if (["/contact", "/about-us", "/blog"].includes(path)) return { priority: "0.8", changefreq: path === "/blog" ? "weekly" : "monthly" };
  if (
    [
      "/terms-and-conditions",
      "/privacy-policy",
      "/disclaimer",
      "/return-policy",
      "/shipping-policy",
    ].includes(path)
  ) {
    return { priority: "0.3", changefreq: "yearly" };
  }
  if (["/autodesk", "/microsoft", "/adobe"].includes(path)) return { priority: "0.8", changefreq: "weekly" };
  if (["/category", "/antivirus"].includes(path)) return { priority: "0.7", changefreq: "weekly" };
  if (path === "/sitemap") return { priority: "0.5", changefreq: "weekly" };
  if (["/how-to-purchase", "/payment-method", "/adobe-cloud"].includes(path))
    return { priority: "0.6", changefreq: "monthly" };
  if (path === "/partner-program") return { priority: "0.5", changefreq: "monthly" };
  return { priority: "0.6", changefreq: "weekly" };
}

async function fetchProductsPage(
  apiBase: string,
  page: number,
  limit: number,
): Promise<{ products: { name: string; version?: string | null; status?: string }[] }> {
  const base = apiBase.replace(/\/+$/, "");
  const res = await fetch(`${base}/api/products?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error(`GET /api/products failed: ${res.status}`);
  return res.json() as Promise<{
    products: { name: string; version?: string | null; status?: string }[];
  }>;
}

async function fetchAllProducts(apiBase: string) {
  const out: { name: string; version?: string | null; status?: string }[] = [];
  let page = 1;
  const limit = 200;
  for (;;) {
    const data = await fetchProductsPage(apiBase, page, limit);
    const batch = data.products || [];
    out.push(...batch);
    if (batch.length < limit) break;
    page += 1;
    if (page > 500) break;
  }
  return out.filter((p) => p.status === "active" || !p.status);
}

async function fetchAllBlogSlugs(apiBase: string): Promise<string[]> {
  const slugs: string[] = [];
  let page = 1;
  const limit = 100;
  const base = apiBase.replace(/\/+$/, "");
  for (;;) {
    const res = await fetch(`${base}/api/blogs?page=${page}&limit=${limit}`);
    if (!res.ok) throw new Error(`GET /api/blogs failed: ${res.status}`);
    const data = (await res.json()) as { blogs?: { slug?: string }[] };
    const blogs = data.blogs || [];
    for (const b of blogs) {
      if (b.slug) slugs.push(b.slug);
    }
    if (blogs.length < limit) break;
    page += 1;
    if (page > 200) break;
  }
  return slugs;
}

function writeSitemap(entries: Entry[]) {
  const deduped = Array.from(new Map(entries.map((e) => [e.loc, e])).values());
  const inner = deduped
    .map(
      (e) =>
        `  <url><loc>${xmlEscape(e.loc)}</loc><changefreq>${e.changefreq}</changefreq><priority>${e.priority}</priority></url>`,
    )
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${inner}\n</urlset>\n`;
  mkdirSync(publicDir, { recursive: true });
  writeFileSync(join(publicDir, "sitemap.xml"), xml, "utf8");
}

async function main() {
  const apiBase = (process.env.VITE_API_BASE_URL || "http://127.0.0.1:5000").replace(/\/+$/, "");

  const entries: Entry[] = STATIC_PATHS.map((path) => ({
    loc: absPath(path),
    ...staticEntryMeta(path),
  }));

  try {
    const products = await fetchAllProducts(apiBase);
    for (const p of products) {
      entries.push({
        loc: absPath(productPathFromProduct(p)),
        priority: "0.7",
        changefreq: "weekly",
      });
    }
    const slugs = await fetchAllBlogSlugs(apiBase);
    for (const slug of slugs) {
      entries.push({
        loc: absPath(`/blog/${slug}`),
        priority: "0.6",
        changefreq: "monthly",
      });
    }
    console.log(`Sitemap: generated ${entries.length} URLs using API ${apiBase}`);
  } catch (err) {
    console.warn("Sitemap: API unavailable, hub URLs only:", err);
  }

  writeSitemap(entries);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
