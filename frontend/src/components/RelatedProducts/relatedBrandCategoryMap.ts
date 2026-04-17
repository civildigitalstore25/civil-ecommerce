import type { Product } from "../../api/types/productTypes";

/** Submenu category slugs per brand (align with header structure). */
export const RELATED_PRODUCTS_BRAND_CATEGORY_MAP: Record<string, string[]> = {
  autodesk: [
    "autocad",
    "autocad-lt",
    "autocad-mechanical",
    "autocad-electrical",
    "autocad-mep",
    "3ds-max",
    "maya",
    "revit",
    "fusion",
    "inventor-professional",
    "civil-3d",
    "map-3d",
    "aec-collection",
    "navisworks-manage",
  ],
  microsoft: [
    "microsoft-365",
    "microsoft-professional",
    "visio-professional",
    "microsoft-projects",
    "server",
  ],
  adobe: [
    "adobe-acrobat",
    "photoshop",
    "lightroom",
    "after-effect",
    "premier-pro",
    "illustrator",
    "adobe-creative-cloud",
  ],
  antivirus: ["k7-security", "quick-heal", "norton"],
};

export function getRelatedProductsBrandKey(product: Product): string | null {
  const brand =
    product.brand?.toLowerCase() || product.company?.toLowerCase() || "";
  if (brand.includes("autodesk")) return "autodesk";
  if (brand.includes("microsoft")) return "microsoft";
  if (brand.includes("adobe")) return "adobe";
  if (
    brand.includes("k7") ||
    brand.includes("quick heal") ||
    brand.includes("norton") ||
    brand.includes("antivirus")
  ) {
    return "antivirus";
  }
  return null;
}
