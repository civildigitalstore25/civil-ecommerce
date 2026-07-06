/** Static internal links injected into index.html for crawlers that do not execute JS. */
export type CrawlNavLink = { href: string; label: string };

export type CrawlNavSection = { title: string; links: CrawlNavLink[] };

export const crawlNavSections: CrawlNavSection[] = [
  {
    title: "Shop",
    links: [
      { href: "/", label: "Home" },
      { href: "/products", label: "All Products" },
      { href: "/category", label: "Categories" },
      { href: "/deals", label: "Deals" },
      { href: "/blog", label: "Blog" },
    ],
  },
  {
    title: "Brands",
    links: [
      { href: "/autodesk", label: "Autodesk" },
      { href: "/microsoft", label: "Microsoft" },
      { href: "/adobe", label: "Adobe" },
      { href: "/adobe-cloud", label: "Adobe Creative Cloud" },
      { href: "/vyapar", label: "Vyapar Offer" },
      { href: "/antivirus", label: "Antivirus" },
      {
        href: "/category?brand=autodesk&category=autocad",
        label: "AutoCAD",
      },
      {
        href: "/category?brand=autodesk&category=revit",
        label: "Revit",
      },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about-us", label: "About Us" },
      { href: "/contact", label: "Contact" },
      { href: "/how-to-purchase", label: "How to Purchase" },
      { href: "/payment-method", label: "Payment Method" },
      { href: "/partner-program", label: "Partner Program" },
      { href: "/sitemap", label: "HTML Sitemap" },
    ],
  },
  {
    title: "Policies",
    links: [
      { href: "/privacy-policy", label: "Privacy Policy" },
      { href: "/terms-and-conditions", label: "Terms and Conditions" },
      { href: "/return-policy", label: "Return and Refund Policy" },
      { href: "/shipping-policy", label: "Shipping and Delivery Policy" },
      { href: "/disclaimer", label: "Disclaimer" },
    ],
  },
];
