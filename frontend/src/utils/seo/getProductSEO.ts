import type { SEOMetadata } from "./seoTypes";
import { CATEGORY_SEO_CONFIG } from "./categorySeoConfig";

export function getProductSEO(product: {
  name: string;
  category?: string;
  company?: string;
  shortDescription?: string;
  price?: number;
}): SEOMetadata {
  const categoryConfig = product.category
    ? CATEGORY_SEO_CONFIG[product.category]
    : null;
  const brandLower = product.company?.toLowerCase() || "";

  const isMajorBrand = ["autodesk", "microsoft", "adobe"].some(
    (brand) =>
      brandLower.includes(brand) || product.category?.includes(brand),
  );

  const isAutoCAD =
    product.name.toLowerCase().includes("autocad") ||
    product.category?.toLowerCase().includes("autocad");

  let title = "";
  let description = "";
  let keywords = "";

  if (isAutoCAD) {
    title = `${product.name} - Buy AutoCAD Software Online | Best Price`;
    description = `Buy ${product.name} - ${product.shortDescription || "Professional AutoCAD software for CAD design and drafting"}. Genuine license with instant delivery.`;
    keywords = `${product.name}, autocad software, buy autocad, autocad license, ${categoryConfig?.keywords || "cad software"}`;
  } else if (isMajorBrand && categoryConfig) {
    title = `${product.name} - Buy ${categoryConfig.name} | Genuine License`;
    description = `Buy ${product.name} - ${product.shortDescription || categoryConfig.description}. Authorized reseller with instant delivery and best price guarantee.`;
    keywords = `${product.name}, ${categoryConfig.keywords}, buy ${categoryConfig.name.toLowerCase()}`;
  } else if (categoryConfig) {
    title = `${product.name} - ${categoryConfig.name} Software | Best Price`;
    description = `${product.name} - ${product.shortDescription || categoryConfig.description}. Genuine software license with instant activation.`;
    keywords = `${product.name}, ${categoryConfig.keywords}`;
  } else {
    title = `${product.name} - Buy Software Online | Genuine License`;
    description = `${product.name} - ${product.shortDescription || "Professional software solution"}. Genuine license with instant delivery and support.`;
    keywords = `${product.name}, buy software online, software license`;
  }

  if (product.price) {
    description += ` Starting at ₹${product.price}.`;
  }

  return {
    title: title.substring(0, 60),
    description: description.substring(0, 160),
    keywords,
    ogTitle: title,
    ogDescription: description.substring(0, 160),
  };
}
