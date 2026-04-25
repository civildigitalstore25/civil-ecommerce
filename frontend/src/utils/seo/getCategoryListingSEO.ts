import type { SEOMetadata } from "./seoTypes";
import { BRAND_SEO_CONFIG } from "./brandSeoConfig";
import { CATEGORY_SEO_CONFIG } from "./categorySeoConfig";

export function getCategoryListingSEO(params: {
  brand?: string;
  category?: string;
  subcategory?: string;
}): SEOMetadata {
  const { brand, category } = params;

  const brandLower = brand?.toLowerCase() || "";

  const categoryConfig = category ? CATEGORY_SEO_CONFIG[category] : null;

  let title = "";
  let description = "";
  let keywords = "";

  if (brand && category && categoryConfig) {
    const isMajorBrand = ["autodesk", "microsoft", "adobe", "projects"].includes(brandLower);

    if (isMajorBrand) {
      title = `Buy ${categoryConfig.name} - ${brand.charAt(0).toUpperCase() + brand.slice(1)} Software | Best Prices`;
      description = `Shop genuine ${categoryConfig.name} software from ${brand}. Authorized reseller with instant delivery, best prices and expert support. ${categoryConfig.description}.`;
      keywords = `${brand} ${categoryConfig.name.toLowerCase()}, ${categoryConfig.keywords}, buy ${brand} software`;
    } else {
      title = `${categoryConfig.name} - ${brand} Software Collection`;
      description = `Browse ${categoryConfig.name} from ${brand}. Genuine software licenses with instant activation and support.`;
      keywords = `${brand} software, ${categoryConfig.keywords}`;
    }
  } else if (brand) {
    const brandConfig =
      BRAND_SEO_CONFIG[brandLower as keyof typeof BRAND_SEO_CONFIG];

    if (brandConfig) {
      title = `Buy ${brandConfig.brandName} Software Online | Genuine Licenses & Best Prices`;
      description = `Shop genuine ${brandConfig.brandName} ${brandConfig.description}. Authorized reseller with instant delivery, competitive pricing and expert support.`;
      keywords = `${brandConfig.keywords}, buy ${brandLower} software, ${brandLower} license`;
    } else {
      title = `${brand.charAt(0).toUpperCase() + brand.slice(1)} Software - Buy Online`;
      description = `Browse ${brand} software collection. Genuine licenses with instant delivery and support.`;
      keywords = `${brand} software, buy ${brand} online`;
    }
  } else if (category && categoryConfig) {
    title = `Buy ${categoryConfig.name} Software Online | Best Prices & Genuine Licenses`;
    description = `Shop ${categoryConfig.name} - ${categoryConfig.description}. Genuine software licenses with instant activation and expert support.`;
    keywords = categoryConfig.keywords;
  } else {
    title =
      "Buy Software Online - AutoCAD, Microsoft, Adobe | Genuine Licenses";
    description =
      "Shop professional software including AutoCAD, Autodesk, Microsoft Office, Adobe Creative Cloud and more. Authorized reseller with best prices and instant delivery.";
    keywords =
      "buy software online, autocad, microsoft office, adobe software, autodesk, genuine software licenses";
  }

  return {
    title: title.substring(0, 60),
    description: description.substring(0, 160),
    keywords,
    ogTitle: title,
    ogDescription: description.substring(0, 160),
  };
}
