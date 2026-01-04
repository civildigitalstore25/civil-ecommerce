export const headerConfig = {
  logo: {
    text: "webforest",
    href: "/",
  },
  navigation: [
    { label: "AutoDesk", href: "/autodesk" },
    { label: "Microsoft", href: "/microsoft" },
    { label: "Adobe", href: "/adobe" },
    { label: "Ebook", href: "/category?brand=ebook" },
    // { label: "Adobe Cloud", href: "/adobe-cloud" },
    { label: "Antivirus", href: "/antivirus" },
    // Super CRM moved to Offers dropdown
    { label: "Contact", href: "/contact" },
  ],
  offers: [
    { label: "Super CRM", href: "/scrm" },
    { label: "Adobe Cloud", href: "/adobe-cloud" },
  ],
  contact: {
    phone: "9042993986",
    phoneHref: "tel:+919042993986",
  },
  search: {
    placeholder: "Search for software, brands, or categories...",
  },
  auth: {
    customer: { label: "Login", href: "/signin" },
    admin: { label: "Register", href: "/signup" },
  },
};
