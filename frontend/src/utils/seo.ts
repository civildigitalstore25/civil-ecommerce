/**
 * SEO Utility for generating dynamic meta tags
 * Provides brand-specific and generic SEO metadata
 */

interface SEOMetadata {
  title: string;
  description: string;
  keywords: string;
  ogTitle?: string;
  ogDescription?: string;
}

// Brand-specific configurations for major software brands
const BRAND_SEO_CONFIG = {
  autodesk: {
    brandName: "Autodesk",
    keywords: "autodesk software, CAD software, BIM software, 3D design",
    description: "leading design and engineering software",
  },
  autocad: {
    brandName: "AutoCAD",
    keywords: "autocad, CAD software, 2D drafting, 3D modeling, architectural design",
    description: "industry-standard CAD software for design and drafting",
  },
  microsoft: {
    brandName: "Microsoft",
    keywords: "microsoft software, office 365, windows, productivity software",
    description: "productivity and business software solutions",
  },
  adobe: {
    brandName: "Adobe",
    keywords: "adobe software, creative cloud, photoshop, illustrator, design software",
    description: "creative and multimedia software solutions",
  },
};

// Category-specific SEO configurations
const CATEGORY_SEO_CONFIG: Record<string, { name: string; keywords: string; description: string }> = {
  // Autodesk Products
  autocad: {
    name: "AutoCAD",
    keywords: "autocad license, autocad software, 2D CAD, 3D CAD, architectural drafting",
    description: "AutoCAD software for professional 2D and 3D CAD design and drafting",
  },
  "3ds-max": {
    name: "3ds Max",
    keywords: "3ds max software, 3D modeling, animation software, rendering",
    description: "3ds Max 3D modeling and animation software for designers",
  },
  revit: {
    name: "Revit",
    keywords: "revit software, BIM software, building design, architectural modeling",
    description: "Revit BIM software for building design and documentation",
  },
  maya: {
    name: "Maya",
    keywords: "maya software, 3D animation, visual effects, modeling software",
    description: "Maya 3D animation and modeling software for professionals",
  },
  fusion: {
    name: "Fusion 360",
    keywords: "fusion 360, CAD CAM software, product design, 3D modeling",
    description: "Fusion 360 CAD/CAM software for product design and manufacturing",
  },
  "civil-3d": {
    name: "Civil 3D",
    keywords: "civil 3d, civil engineering software, infrastructure design",
    description: "Civil 3D software for civil engineering and infrastructure design",
  },
  "aec-collection": {
    name: "AEC Collection",
    keywords: "aec collection, autodesk collection, architecture software bundle",
    description: "Autodesk AEC Collection for architecture, engineering and construction",
  },

  // Microsoft Products
  "microsoft-365": {
    name: "Microsoft 365",
    keywords: "microsoft 365, office 365, ms office, productivity suite",
    description: "Microsoft 365 subscription with Office apps and cloud services",
  },
  "microsoft-professional": {
    name: "Microsoft Office Professional",
    keywords: "microsoft office professional, ms office, office suite",
    description: "Microsoft Office Professional for business productivity",
  },
  windows: {
    name: "Windows",
    keywords: "windows license, windows OS, operating system, microsoft windows",
    description: "Microsoft Windows operating system licenses",
  },

  // Adobe Products
  "adobe-acrobat": {
    name: "Adobe Acrobat",
    keywords: "adobe acrobat, pdf editor, pdf software, document management",
    description: "Adobe Acrobat Pro for PDF creation, editing and management",
  },
  photoshop: {
    name: "Adobe Photoshop",
    keywords: "photoshop, photo editing software, image editor, graphic design",
    description: "Adobe Photoshop for professional photo editing and graphic design",
  },
  "adobe-creative-cloud": {
    name: "Adobe Creative Cloud",
    keywords: "adobe creative cloud, creative suite, design software bundle",
    description: "Adobe Creative Cloud all-in-one creative software suite",
  },
  illustrator: {
    name: "Adobe Illustrator",
    keywords: "illustrator, vector graphics, logo design, graphic design software",
    description: "Adobe Illustrator for vector graphics and logo design",
  },
  "premier-pro": {
    name: "Adobe Premiere Pro",
    keywords: "premiere pro, video editing software, video production",
    description: "Adobe Premiere Pro for professional video editing",
  },

  // Generic categories
  antivirus: {
    name: "Antivirus Software",
    keywords: "antivirus software, security software, malware protection",
    description: "antivirus and security software solutions",
  },
  "structural-softwares": {
    name: "Structural Software",
    keywords: "structural analysis software, engineering software, building design",
    description: "structural analysis and design software for engineers",
  },
  coreldraw: {
    name: "CorelDRAW",
    keywords: "coreldraw, vector graphics, graphic design software",
    description: "CorelDRAW graphics suite for vector illustration and design",
  },
};

/**
 * Generate SEO metadata for homepage
 */
export const getHomeSEO = (): SEOMetadata => {
  return {
    title: "Softzcart - Buy AutoCAD, Autodesk, Microsoft, Adobe Software Online | Best Prices",
    description: "Shop genuine AutoCAD, Autodesk, Microsoft Office, Adobe Creative Cloud and other professional software at best prices. Authorized reseller with instant delivery and support.",
    keywords: "software store, autocad price, autodesk software, microsoft office, adobe creative cloud, buy software online, genuine software licenses",
    ogTitle: "Softzcart - Authorized Software Reseller | AutoCAD, Microsoft, Adobe",
    ogDescription: "Buy genuine AutoCAD, Microsoft Office, Adobe and other professional software with instant delivery and best prices.",
  };
};

/**
 * Generate SEO metadata for product detail pages
 */
export const getProductSEO = (product: {
  name: string;
  category?: string;
  company?: string;
  shortDescription?: string;
  price?: number;
}): SEOMetadata => {
  const categoryConfig = product.category ? CATEGORY_SEO_CONFIG[product.category] : null;
  const brandLower = product.company?.toLowerCase() || "";
  
  // Determine if this is a major brand product
  const isMajorBrand = ["autodesk", "microsoft", "adobe"].some(brand => 
    brandLower.includes(brand) || product.category?.includes(brand)
  );

  const isAutoCAD = product.name.toLowerCase().includes("autocad") || 
                    product.category?.toLowerCase().includes("autocad");
  
  let title = "";
  let description = "";
  let keywords = "";

  if (isAutoCAD) {
    // Specific AutoCAD optimization
    title = `${product.name} - Buy AutoCAD Software Online | Best Price`;
    description = `Buy ${product.name} - ${product.shortDescription || "Professional AutoCAD software for CAD design and drafting"}. Genuine license with instant delivery.`;
    keywords = `${product.name}, autocad software, buy autocad, autocad license, ${categoryConfig?.keywords || "cad software"}`;
  } else if (isMajorBrand && categoryConfig) {
    // Major brands (Autodesk, Microsoft, Adobe) get specific treatment
    title = `${product.name} - Buy ${categoryConfig.name} | Genuine License`;
    description = `Buy ${product.name} - ${product.shortDescription || categoryConfig.description}. Authorized reseller with instant delivery and best price guarantee.`;
    keywords = `${product.name}, ${categoryConfig.keywords}, buy ${categoryConfig.name.toLowerCase()}`;
  } else if (categoryConfig) {
    // Other branded software with category config
    title = `${product.name} - ${categoryConfig.name} Software | Best Price`;
    description = `${product.name} - ${product.shortDescription || categoryConfig.description}. Genuine software license with instant activation.`;
    keywords = `${product.name}, ${categoryConfig.keywords}`;
  } else {
    // Generic software
    title = `${product.name} - Buy Software Online | Genuine License`;
    description = `${product.name} - ${product.shortDescription || "Professional software solution"}. Genuine license with instant delivery and support.`;
    keywords = `${product.name}, buy software online, software license`;
  }

  // Add price to description if available
  if (product.price) {
    description += ` Starting at ₹${product.price}.`;
  }

  return {
    title: title.substring(0, 60), // Google typically shows 50-60 chars
    description: description.substring(0, 160), // Google shows up to 160 chars
    keywords,
    ogTitle: title,
    ogDescription: description.substring(0, 160),
  };
};

/**
 * Generate SEO metadata for category/brand listing pages
 */
export const getCategoryListingSEO = (params: {
  brand?: string;
  category?: string;
  subcategory?: string;
}): SEOMetadata => {
  const { brand, category } = params;
  
  const brandLower = brand?.toLowerCase() || "";
  
  const categoryConfig = category ? CATEGORY_SEO_CONFIG[category] : null;
  
  let title = "";
  let description = "";
  let keywords = "";

  // Brand + Category (most specific)
  if (brand && category && categoryConfig) {
    const isMajorBrand = ["autodesk", "microsoft", "adobe"].includes(brandLower);
    
    if (isMajorBrand) {
      title = `Buy ${categoryConfig.name} - ${brand.charAt(0).toUpperCase() + brand.slice(1)} Software | Best Prices`;
      description = `Shop genuine ${categoryConfig.name} software from ${brand}. Authorized reseller with instant delivery, best prices and expert support. ${categoryConfig.description}.`;
      keywords = `${brand} ${categoryConfig.name.toLowerCase()}, ${categoryConfig.keywords}, buy ${brand} software`;
    } else {
      title = `${categoryConfig.name} - ${brand} Software Collection`;
      description = `Browse ${categoryConfig.name} from ${brand}. Genuine software licenses with instant activation and support.`;
      keywords = `${brand} software, ${categoryConfig.keywords}`;
    }
  }
  // Brand only
  else if (brand) {
    const brandConfig = BRAND_SEO_CONFIG[brandLower as keyof typeof BRAND_SEO_CONFIG];
    
    if (brandConfig) {
      title = `Buy ${brandConfig.brandName} Software Online | Genuine Licenses & Best Prices`;
      description = `Shop genuine ${brandConfig.brandName} ${brandConfig.description}. Authorized reseller with instant delivery, competitive pricing and expert support.`;
      keywords = `${brandConfig.keywords}, buy ${brandLower} software, ${brandLower} license`;
    } else {
      title = `${brand.charAt(0).toUpperCase() + brand.slice(1)} Software - Buy Online`;
      description = `Browse ${brand} software collection. Genuine licenses with instant delivery and support.`;
      keywords = `${brand} software, buy ${brand} online`;
    }
  }
  // Category only
  else if (category && categoryConfig) {
    title = `Buy ${categoryConfig.name} Software Online | Best Prices & Genuine Licenses`;
    description = `Shop ${categoryConfig.name} - ${categoryConfig.description}. Genuine software licenses with instant activation and expert support.`;
    keywords = categoryConfig.keywords;
  }
  // All products
  else {
    title = "Buy Software Online - AutoCAD, Microsoft, Adobe | Genuine Licenses";
    description = "Shop professional software including AutoCAD, Autodesk, Microsoft Office, Adobe Creative Cloud and more. Authorized reseller with best prices and instant delivery.";
    keywords = "buy software online, autocad, microsoft office, adobe software, autodesk, genuine software licenses";
  }

  return {
    title: title.substring(0, 60),
    description: description.substring(0, 160),
    keywords,
    ogTitle: title,
    ogDescription: description.substring(0, 160),
  };
};

/**
 * Generate SEO metadata for cart page
 */
export const getCartSEO = (): SEOMetadata => {
  return {
    title: "Shopping Cart - Softzcart",
    description: "Review your selected software products and proceed to checkout. Secure payment and instant delivery.",
    keywords: "shopping cart, buy software, checkout",
  };
};

/**
 * Generate SEO metadata for checkout page
 */
export const getCheckoutSEO = (): SEOMetadata => {
  return {
    title: "Checkout - Complete Your Order | Softzcart",
    description: "Complete your software purchase securely. Multiple payment options with instant delivery and activation.",
    keywords: "checkout, buy software, secure payment",
  };
};

/**
 * Generate SEO metadata for contact page
 */
export const getContactSEO = (): SEOMetadata => {
  return {
    title: "Contact Us - Software Sales Support | Softzcart",
    description: "Get in touch with our software experts. Support for AutoCAD, Microsoft, Adobe and all software products. Quick response guaranteed.",
    keywords: "contact us, software support, customer service, software sales",
  };
};

/**
 * Generate SEO metadata for about page
 */
export const getAboutSEO = (): SEOMetadata => {
  return {
    title: "About Softzcart - Authorized Software Reseller",
    description: "Leading authorized reseller of AutoCAD, Microsoft, Adobe and professional software. Trusted by thousands of customers with genuine licenses and expert support.",
    keywords: "about us, software reseller, authorized dealer, autodesk reseller, microsoft partner",
  };
};

/**
 * Default/Fallback SEO metadata
 */
export const getDefaultSEO = (): SEOMetadata => {
  return {
    title: "Softzcart - Buy Genuine Software Online | AutoCAD, Microsoft, Adobe",
    description: "Shop genuine AutoCAD, Autodesk, Microsoft Office, Adobe and professional software at best prices. Authorized reseller with instant delivery.",
    keywords: "software store, buy software online, autocad, microsoft office, adobe, genuine licenses",
  };
};
