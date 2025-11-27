export const headerConfig = {
  logo: {
    text: "webforest",
    href: "/",
  },
  navigation: [
    { label: "AutoDesk", href: "/autodesk" },
    { label: "Microsoft", href: "/microsoft" },
    { label: "Adobe", href: "/adobe" },
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
    phone: "790-355-4767",
    phoneHref: "tel:+17903554767",
  },
  search: {
    placeholder: "Search for software, brands, or categories...",
  },
  auth: {
    customer: { label: "Login", href: "/signin" },
    admin: { label: "Register", href: "/signup" },
  },
};
