import { FooterNavLink } from "./FooterNavLink";

export function renderFooterLinkList(
  items: { to: string; label: string }[],
  footerTextPrimary: string,
  footerTextSecondary: string,
) {
  return items.map((item) => (
    <li key={item.to}>
      <FooterNavLink
        to={item.to}
        footerTextPrimary={footerTextPrimary}
        footerTextSecondary={footerTextSecondary}
      >
        {item.label}
      </FooterNavLink>
    </li>
  ));
}

export const footerServicesLinks = [
  { to: "/shipping-policy", label: "Shipping & Delivery Policy" },
  { to: "/how-to-purchase", label: "How to Purchase" },
  { to: "/payment-method", label: "Payment Method" },
  { to: "/privacy-policy", label: "Privacy Policy" },
  { to: "/sitemap", label: "Site Map" },
];

export const footerPolicyLinks = [
  { to: "/terms-and-conditions", label: "Terms and Conditions" },
  { to: "/partner-program", label: "Partner Program" },
  { to: "/return-policy", label: "Return and Refund Policy" },
  { to: "/disclaimer", label: "Disclaimer" },
];

export const footerSoftwareLinks = [
  { to: "/category?brand=autodesk&category=autocad", label: "AutoCAD" },
  { to: "/category?brand=architectural-softwares&category=lumion", label: "Lumion" },
  { to: "/category?brand=microsoft&category=microsoft-365", label: "MS Office" },
  { to: "/category?brand=structural-softwares&category=tekla", label: "Tekla" },
  { to: "/category?brand=autodesk&category=revit", label: "Revit" },
];
