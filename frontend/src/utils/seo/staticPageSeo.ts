import type { SEOMetadata } from "./seoTypes";

export function getHomeSEO(): SEOMetadata {
  return {
    title:
      "Softzcart - Software Reseller | Developer Tools & IT Solutions",
    description:
      "Softzcart is an authorized software reseller for AutoCAD, Autodesk, Microsoft Office, Adobe Creative Cloud, and more—plus developer tools and IT solutions with instant delivery and expert support.",
    keywords:
      "softzcart, software reseller, authorized software reseller, software store, autocad price, autodesk software, microsoft office, adobe creative cloud, buy software online, developer tools",
    ogTitle:
      "Softzcart - Software Reseller | Developer Tools & IT Solutions",
    ogDescription:
      "Shop Softzcart—authorized software reseller for leading vendor software, developer tools, and IT solutions, with instant delivery and expert support.",
  };
}

export function getCartSEO(): SEOMetadata {
  return {
    title: "Shopping Cart - Softzcart",
    description:
      "Review your selected software products and proceed to checkout. Secure payment and instant delivery.",
    keywords: "shopping cart, buy software, checkout",
  };
}

export function getCheckoutSEO(): SEOMetadata {
  return {
    title: "Checkout - Complete Your Order | Softzcart",
    description:
      "Complete your software purchase securely. Multiple payment options with instant delivery and activation.",
    keywords: "checkout, buy software, secure payment",
  };
}

export function getContactSEO(): SEOMetadata {
  return {
    title: "Contact Us - Software Sales Support | Softzcart",
    description:
      "Get in touch with our software experts. Support for AutoCAD, Microsoft, Adobe and all software products. Quick response guaranteed.",
    keywords:
      "contact us, software support, customer service, software sales",
  };
}

export function getAboutSEO(): SEOMetadata {
  return {
    title: "About Softzcart - Authorized Software Reseller",
    description:
      "Leading authorized reseller of AutoCAD, Microsoft, Adobe and professional software. Trusted by thousands of customers with genuine licenses and expert support.",
    keywords:
      "about us, software reseller, authorized dealer, autodesk reseller, microsoft partner",
  };
}
